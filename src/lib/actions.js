"use server";

import { createAdminClient, createSessionClient } from "@/appwrite/config";
import auth from "./auth";
import { cookies } from "next/headers";
import { ID, Permission, Query, Role } from "node-appwrite";
import { redirect } from "next/navigation";
import { fetchProductDetails, fetchSellerDetails } from "./data";

import { revalidatePath } from "next/cache";
import { generateReferralCode, parseDuration } from "./utils";
import { Resend } from "resend";

// Login
export async function createLoginSession(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { email, password } = data;
  let user;
  try {
    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("session", session.secret, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      expires: new Date(session.expire),
      path: "/",
    });

    user = await auth.getUser();
  } catch (error) {
    return { message: error?.message };
  }
  redirect(`/${user.labels?.[0] || "unknown"}/overview`);
}

// Registeration
export async function createSellerAccount(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { name, email, password } = data;
  let user;
  try {
    const { users, account, databases } = await createAdminClient();

    // creates new auth seller account
    const newSellerAccount = await account.create(
      ID.unique(),
      email,
      password,
      name
    );

    // creates new stripe account for the seller
    const newStripeAccount = await stripe.accounts.create({
      email: email,
      metadata: {
        sellerId: newSellerAccount.$id,
      },
      controller: {
        losses: {
          payments: "application",
        },
        fees: {
          payer: "application",
        },
        stripe_dashboard: {
          type: "express",
        },
      },
    });

    // sets prefs of the user
    await users.updatePrefs(
      newSellerAccount.$id, // userId
      {
        connectedAccountId: `${newStripeAccount.id}`,
        stripeConnectedLinked: "false",
      } // prefs
    );
    // sets prefs of the user
    await users.updateLabels(
      newSellerAccount.$id, // userId
      ["seller"] // prefs
    );

    // Creates a login sessions for the new seller
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("session", session.secret, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      expires: new Date(session.expire),
      path: "/",
    });

    user = await auth.getUser();
  } catch (error) {
    return { message: error?.message };
  }

  revalidatePath("/", "layout");
  const isAdmin = user.labels.includes("admin");
  if (isAdmin) redirect("/admin/overview");
  else redirect("/seller/listings");
}

// Create Strip Account Link
export async function CreateStripeAccountLink(prevState) {
  console.log("creating...");
  console.log("fetching user...");
  const user = await auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  let accountLink;
  let userDetails;

  try {
    console.log("fetching user details...");

    accountLink = await stripe.accountLinks.create({
      account: user?.prefs?.connectedAccountId,
      refresh_url: `${process.env.NEXT_PUBLIC_DOMAIN}/stripe/account/${user?.$id}`,
      return_url: `${process.env.NEXT_PUBLIC_DOMAIN}/stripe/account/${user?.$id}`,
      type: "account_onboarding",
    });

    console.log("returning for redirect ...");
  } catch (error) {
    return { message: error?.message };
  }
  revalidatePath("/", "layout");
  return redirect(accountLink.url);
}

// Give Stripe Dashboard Link
export async function GetStripeDashboardLink(prevState) {
  const user = await auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  let loginLink;
  let userDetails;
  try {
    loginLink = await stripe.accounts.createLoginLink(
      user?.prefs?.connectedAccountId
    );
  } catch (error) {
    return { message: error?.message };
  }
  return redirect(loginLink.url);
}

// Ticket Buying Link
export async function BuyTicket(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { listingId, productId, licenseplateno } = data;
  const storekwilCommission =
    parseFloat(process.env.NEXT_PUBLIC_storekwil_RATE || 10) / 100;
  let session;
  try {
    const productDetails = await fetchProductDetails(productId);
    const { users, databases } = await createAdminClient();
    const { prefs } = await users.get(productDetails.property.user);

    // create ticket
    const ticketID = ID.unique();

    session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount_decimal: Math.round(productDetails?.price),
            product_data: {
              name: productDetails?.title,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        ProductID: productId,
        TicketID: ticketID,
        License: licenseplateno,
        ListingID: listingId,
        ProductName: productDetails?.title,
        ProductPrice: productDetails?.price,
        duration: productDetails?.duration,
      },

      payment_intent_data: {
        application_fee_amount: Math.round(
          productDetails?.price * storekwilCommission
        ),
        transfer_data: {
          destination: prefs.connectedAccountId,
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/stripe/payment/${ticketID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/listings/${listingId}/purchase/${productId}`,
    });
  } catch (error) {
    return { message: error?.message };
  }

  revalidatePath("/", "layout");
  return redirect(session.url);
}

// Create Listing
export async function createListing(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { listingTitle, description } = data;

  const mediaFiles = Array.from(formData.getAll("media"));
  // console.log("media", mediaFiles);

  if (mediaFiles.length > 5) {
    return {
      message:
        "You can only upload a maximum of 5 files. Please Reselect the files",
    };
  }

  // const parsedAmount = amount.replace(",", ".");
  // const centsAmount = Math.round(parseFloat(parsedAmount) * 100);
  // price: parseInt(centsAmount),

  const sessionCookie = cookies().get("session");
  try {
    const user = await auth.getUser();
    const { databases } = await createSessionClient(sessionCookie.value);

    const newLisitng = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_PROPERTIES,
      ID.unique(),
      {
        name: listingTitle,
        smallDescription: description,
        user: user.$id,
      }
    );

    await Promise.all(
      mediaFiles.map((file) => uploadMedia(file, newLisitng.$id))
    );
  } catch (error) {
    console.error("ERROR in createListing", error);
    return { message: error?.message };
    return;
  }
  revalidatePath("/", "layout");
  redirect(`/seller/listings`);
}

// Verify OTP
export async function verifyOTP(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { otp, challengeId } = data;
  console.log("otp",otp)
  console.log("challengeId",challengeId)
  

  const sessionCookie = cookies().get("session");
  let user;
  try {
    const { account } = await createSessionClient(sessionCookie.value);

    await account.updateMfaChallenge(challengeId, otp);
     user = await auth.getUser();

    // return {
    //   message: "verification Successfull \n redirecting...",
    //   type: "success",
    // };
  } catch (error) {
    return { message: error?.message, type: "error" };
  }
  redirect(`/${user.labels?.[0] || "unknown"}/overview`);
}

// Udpate Listing
export async function updateListing(formData) {
  const data = Object.fromEntries(formData);
  const { listingId, listingTitle, description } = data;

  const sessionCookie = cookies().get("session");
  try {
    const user = await auth.getUser();
    const { databases } = await createSessionClient(sessionCookie.value);

    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_PROPERTIES,
      listingId,
      {
        name: listingTitle,
        smallDescription: description,
      }
    );
  } catch (error) {
    console.error("ERROR in createListing", error);
    return;
  }
  revalidatePath("/", "layout");
  redirect(`/seller/listings`);
}

// Delete  A Listing
export async function deleteListing(formData) {
  const data = Object.fromEntries(formData);
  const { listingId, mediaId } = data;

  const mediaIds = JSON.parse(mediaId);

  console.log("listingId", listingId);
  console.log("mediaIds", mediaIds);

  const sessionCookie = cookies().get("session");
  try {
    const { databases, storage } = await createSessionClient(
      sessionCookie.value
    );
    await Promise.all([
      databases.deleteDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_ID_PROPERTIES,
        listingId
      ),
      ...mediaIds.map((fileID) =>
        storage.deleteFile(process.env.NEXT_PUBLIC_BUCKET_ID, fileID)
      ),
    ]);
  } catch (error) {
    console.error("ERROR in deleteListing", error);
    return;
  }

  // revalidatePath("/seller/listings");
  revalidatePath("/", "layout");
}

// create Product
export async function createProduct(formData) {
  const data = Object.fromEntries(formData);
  const { listingId, productTitle, duration, amount, durationType } = data;

  const parsedAmount = amount.replace(",", ".");
  const centsAmount = Math.round(parseFloat(parsedAmount) * 100);

  const parsedDuration = parseDuration(duration, durationType);
  console.log(duration, durationType, parsedDuration);
  const sessionCookie = cookies().get("session");
  try {
    const { databases } = await createSessionClient(sessionCookie.value);

    await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_PRODUCTS,
      ID.unique(),
      {
        title: productTitle,
        price: parseInt(centsAmount),
        duration: parseInt(parsedDuration),
        property: listingId,
      }
    );
  } catch (error) {
    console.error("ERROR in createProduct", error);
    return;
  }
  // revalidatePath(`/seller/listings/${listingId}`);
  revalidatePath("/", "layout");
  redirect(`/seller/listings/${listingId}`);
}

// update Product
export async function updateProduct(formData) {
  const data = Object.fromEntries(formData);
  const { listingId, productId, productTitle, duration, amount, durationType } =
    data;

  const parsedAmount = amount.replace(",", ".");
  const centsAmount = Math.round(parseFloat(parsedAmount) * 100);

  const parsedDuration = parseDuration(duration, durationType);

  const sessionCookie = cookies().get("session");
  try {
    const { databases } = await createSessionClient(sessionCookie.value);

    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_PRODUCTS,
      productId,
      {
        title: productTitle,
        price: parseInt(centsAmount),
        duration: parseInt(parsedDuration),
      }
    );
  } catch (error) {
    console.error("ERROR in updateProduct", error);
    return;
  }

  // revalidatePath(`/seller/listings/${listingId}`);
  revalidatePath("/", "layout");
  redirect(`/seller/listings/${listingId}`);
}

// Delete  A Product
export async function deleteProduct(formData) {
  const data = Object.fromEntries(formData);
  const { productId, listingId } = data;

  const sessionCookie = cookies().get("session");
  try {
    const { databases } = await createSessionClient(sessionCookie.value);
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_PRODUCTS,
      productId
    );
  } catch (error) {
    console.error("ERROR in deleteProduct", error);
    return;
  }

  // revalidatePath(`/seller/listings/${listingId}`);
  revalidatePath("/", "layout");
}

// Delete Media
export async function deleteMedia(docId, storageId, listingId) {
  const sessionCookie = cookies().get("session");

  try {
    const { databases, storage } = await createSessionClient(
      sessionCookie.value
    );

    console.log("deleting..storage with id", storageId);
    // Delete File
    await storage.deleteFile(process.env.NEXT_PUBLIC_BUCKET_ID, storageId);
    // Delete Media

    console.log("deleting..media document with id", docId);
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_MEDIA,
      docId
    );

    console.log("Revalidating the listing edit form ", listingId);
    // revalidatePath(`/seller/listings/${listingId}/edit`);
  } catch (error) {
    console.error("ERROR in deleteMedia", error);
    return;
  }

  revalidatePath("/", "layout");
}

export async function uploadListingImg(formData) {
  const data = Object.fromEntries(formData);
  const { file, listingId } = data;

  const sessionCookie = cookies().get("session");

  try {
    const { databases, storage } = await createSessionClient(
      sessionCookie.value
    );

    // Upload File
    const uploadedfile = await storage.createFile(
      process.env.NEXT_PUBLIC_BUCKET_ID,
      ID.unique(),
      file
    );

    // Store the file in media collection with specific listing ID
    await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_MEDIA,
      ID.unique(),
      {
        link: `${process.env.NEXT_PUBLIC_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_ID}/files/${uploadedfile.$id}/view?project=${process.env.NEXT_PUBLIC_PROJECT_ID}`,
        property: listingId,
        mediaId: uploadedfile.$id,
      }
    );
    revalidatePath("/", "layout");
    return true;
  } catch (error) {
    console.error("ERROR in uploadListingImg", error);
    return;
  }
}

// storekwil
export async function createNewUser(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { name, email, password, role } = data;

  try {
    const { users, account } = await createAdminClient();

    // creates new auth user account
    const newUserAcct = await account.create(
      ID.unique(),
      email,
      password,
      name
    );

    // sets labels of the user as per role
    await users.updateLabels(
      newUserAcct.$id, // userId
      [role]
    );
    // sets Email Verification of the user
    await users.updateEmailVerification(
      newUserAcct.$id, // userId
      true
    );
    // update MFA of the user
    await users.updateMfa(
      newUserAcct.$id, // userId
      true
    );

    return { message: "User Created Successfully", type: "success" };
  } catch (error) {
    return { message: error?.message, type: "error" };
  }
}

export async function uploadDocument(prevState, formData) {
  const data = Object.fromEntries(formData);

  const { file_input, docPermissions, caseId } = data;

  const sessionCookie = cookies().get("session");

  try {
    const { databases, storage, account } = await createSessionClient(
      sessionCookie.value
    );

    const user = await account.get();

    // Upload File
    const uploadedfile = await storage.createFile(
      process.env.NEXT_PUBLIC_BUCKET_ID,
      ID.unique(),
      file_input
    );

    if (docPermissions) {
      // Store the file in media collection with specific listing ID
      await databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_ID_DOCUMENTS,
        ID.unique(),
        {
          path: `${process.env.NEXT_PUBLIC_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_ID}/files/${uploadedfile.$id}/download?project=${process.env.NEXT_PUBLIC_PROJECT_ID}&mode=admin`,
          case: caseId,
          createdBy: user.$id,
          name: file_input.name,
        },
        [Permission.read(Role.users())]
      );
    } else {
      // Store the file in media collection with specific listing ID
      await databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_ID_DOCUMENTS,
        ID.unique(),
        {
          path: `${process.env.NEXT_PUBLIC_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_ID}/files/${uploadedfile.$id}/download?project=${process.env.NEXT_PUBLIC_PROJECT_ID}&mode=admin`,
          case: caseId,
          createdBy: user.$id,
          name: file_input.name,
        }
      );
    }

    // revalidatePath(`/seller/listings/${listingId}/edit`);
    revalidatePath("/", "layout");
    return { message: "Document Uploaded Successfully", type: "success" };
  } catch (error) {
    return { message: error?.message, type: "error" };
  }
}

export async function addComment(prevState, formData) {
  const data = Object.fromEntries(formData);

  const { commentContent, commentPermission, caseId } = data;

  const sessionCookie = cookies().get("session");

  try {
    const { databases, account } = await createSessionClient(
      sessionCookie.value
    );

    const user = await account.get();

    if (commentPermission) {
      // Store the file in media collection with specific listing ID
      await databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_ID_COMMENTS,
        ID.unique(),
        {
          content: commentContent,
          case: caseId,
          createdBy: user.$id,
        },
        [Permission.read(Role.users())]
      );
    } else {
      // Store the file in media collection with specific listing ID
      await databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_ID_COMMENTS,
        ID.unique(),
        {
          content: commentContent,
          case: caseId,
          createdBy: user.$id,
        }
      );
    }

    // revalidatePath(`/seller/listings/${listingId}/edit`);
    revalidatePath("/", "layout");
    return { message: "Comment Published Successfully", type: "success" };
  } catch (error) {
    return { message: error?.message, type: "error" };
  }
}

export async function reviewDecision(prevState, formData) {
  const data = Object.fromEntries(formData);

  const { acceptance, caseId } = data;
  const status = acceptance === "true" ? "pending" : "declined";

  // console.log("acceptance",acceptance)

  try {
    const { databases } = await createAdminClient();

    // Store the file in media collection with specific listing ID
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_CASES,
      caseId,
      {
        status: status,
      }
    );

    // revalidatePath(`/seller/listings/${listingId}/edit`);
    revalidatePath("/", "layout");
    return { message: "Review Submitted Successfully", type: "success" };
  } catch (error) {
    return { message: error?.message, type: "error" };
  }
}

export async function wonLostDecision(prevState, formData) {
  const data = Object.fromEntries(formData);

  const { acceptance, caseId } = data;
  const status = acceptance === "true" ? "won" : "lost";

  // console.log("acceptance",acceptance)

  try {
    const { databases } = await createAdminClient();

    // Store the file in media collection with specific listing ID
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_CASES,
      caseId,
      {
        status: status,
      }
    );

    // revalidatePath(`/seller/listings/${listingId}/edit`);
    revalidatePath("/", "layout");
    return { message: "Case Status Updated", type: "success" };
  } catch (error) {
    return { message: error?.message, type: "error" };
  }
}

export async function approveDelcineDecision(prevState, formData) {
  const data = Object.fromEntries(formData);

  const { acceptance, caseId } = data;
  const status = acceptance === "true" ? "approved" : "declined";
  const isApproved = acceptance === "true" ? true : false;

  // console.log("acceptance",acceptance)

  try {
    const { databases } = await createAdminClient();

    // Store the file in media collection with specific listing ID
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_CASES,
      caseId,
      {
        status: status,
        is_approved: isApproved,
      }
    );

    // revalidatePath(`/seller/listings/${listingId}/edit`);
    revalidatePath("/", "layout");
    return { message: "Decision Submitted Successfully", type: "success" };
  } catch (error) {
    return { message: error?.message, type: "error" };
  }
}
export async function updateCaseProgress(prevState, formData) {
  const data = Object.fromEntries(formData);

  const {
    compensationLawyer,
    compensationstorekwil,
    compensationVictim,
    caseId,
  } = data;

  // Victim Amount

  const parsedVictimAmount = compensationVictim.replace(",", ".");
  const victimAmount = Math.round(parseFloat(parsedVictimAmount) * 100);

  // Lawyer Amount

  const parsedLawyerAmount = compensationLawyer.replace(",", ".");
  const lawyerAmount = Math.round(parseFloat(parsedLawyerAmount) * 100);

  // storekwil Amount

  const parsedstorekwilAmount = compensationstorekwil.replace(",", ".");
  const storekwilAmount = Math.round(parseFloat(parsedstorekwilAmount) * 100);

  const sessionCookie = cookies().get("session");

  try {
    const { databases } = await createSessionClient(sessionCookie.value);

    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_CASES,
      caseId,
      {
        is_compensation_paid: true,
        compensation_amount_lawyer: lawyerAmount,
        compensation_amount_storekwil: storekwilAmount,
        compensation_amount_victim: victimAmount,
      }
    );

    revalidatePath("/", "layout");
    return { message: "Case Progress Updated Successfully", type: "success" };
  } catch (error) {
    return { message: error?.message, type: "error" };
  }
}

export async function assignLawyer(caseId, victimId, prevState, formData) {
  const data = Object.fromEntries(formData);

  const { lawyerId } = data;

  const sessionCookie = cookies().get("session");

  try {
    const { databases } = await createSessionClient(sessionCookie.value);

    // Store the file in media collection with specific listing ID
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_CASES,
      caseId,
      {
        lawyer: lawyerId,
        status: "assigned",
      }
      //   [
      //     Permission.read(Role.user(lawyerId)),        // Add Permission for Lawyer Read Access
      //     Permission.update(Role.user(lawyerId)),      // Add Permission for Lawyer Update Access
      //     Permission.read(Role.user(victimId)),                // Add Permission for Victim Read Access
      // ]
      // Add Permission for Lawyer Read Access
    );

    revalidatePath("/", "layout");
    return { message: "Lawyer Assigned Successfully", type: "success" };
  } catch (error) {
    return { message: error?.message, type: "error" };
  }
}

export async function submitForReview(caseId, prevState, formData) {
  try {
    const { databases } = await createAdminClient();

    // Store the file in media collection with specific listing ID
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_CASES,
      caseId,
      {
        status: "review",
      }
    );

    // revalidatePath(`/seller/listings/${listingId}/edit`);
    revalidatePath("/", "layout");
    return { message: "Submitted to Supervisor", type: "success" };
  } catch (error) {
    return { message: error?.message, type: "error" };
  }
}

export async function createNewVictim(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { name, email } = data;

  try {
    const { users, account } = await createAdminClient();

    // creates new auth user account
    const newUserAcct = await account.create(
      ID.unique(),
      email,
      "123456789",
      name
    );

    // sets labels of the user as per role
    await users.updateLabels(
      newUserAcct.$id, // userId
      ["victim"]
    );

    revalidatePath("/", "layout");

    return { message: "Victim Created Successfully", type: "success" };
  } catch (error) {
    return { message: error?.message, type: "error" };
  }
}

export async function createNewPlatform(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { name, email, url, address } = data;

  try {
    const { databases } = await createAdminClient();

    await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_PLATFORM,
      ID.unique(),
      {
        name: name,
        email: email,
        url: url,
        address: address,
      }
    );

    revalidatePath("/", "layout");

    return { message: "Platform Created Successfully", type: "success" };
  } catch (error) {
    return { message: error?.message, type: "error" };
  }
}
export async function createNewProfileHandle(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { profileUrl, profileHandle, profileId, platform } = data;

  try {
    const { databases } = await createAdminClient();

    await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_PROFILE,
      ID.unique(),
      {
        profileUrl: profileUrl,
        profileHandle: profileHandle,
        profileId: profileId,
        platform: platform,
      }
    );

    revalidatePath("/", "layout");

    return { message: "UserHandle Created Successfully", type: "success" };
  } catch (error) {
    return { message: error?.message, type: "error" };
  }
}
export async function createNewPerpetrator(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { firstName, lastName, email, birthDate, address, additionalInfo } =
    data;

  try {
    const { databases } = await createAdminClient();

    await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_PERPETRATOR,
      ID.unique(),
      {
        firstName,
        lastName,
        email,
        birthDate,
        address,
        additionalInfo,
      }
    );

    revalidatePath("/", "layout");

    return { message: "New Perpetrator Created Successfully", type: "success" };
  } catch (error) {
    return { message: error?.message, type: "error" };
  }
}

export async function createNewCase(VictimID) {
  try {
    const { databases } = await createAdminClient();

    const newCase = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_CASES,
      ID.unique(),
      {
        victim: VictimID,
      },
      [
        Permission.read(Role.user(VictimID)), // Add Permission for Lawyer Read Access
        Permission.update(Role.user(VictimID)), // Add Permission for Lawyer Update Access
      ]
    );

    revalidatePath("/", "layout");
    return newCase.$id;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function createNewPosting(
  text,
  description,
  platform,
  createdBy,
  profileHandle,
  caseId
) {
  try {
    const { databases } = await createAdminClient();

    const newCase = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_POSTINGS,
      ID.unique(),
      {
        text,
        description,
        platform,
        createdBy,
        profileHandle,
        caseId,
      }
    );

    revalidatePath("/", "layout");
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function updateNewCase(caseID, perpetratorID) {
  try {
    const { databases } = await createAdminClient();

    const newCase = await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_CASES,
      caseID,
      {
        perpetrator: perpetratorID,
      }
    );

    revalidatePath("/", "layout");
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// Storekwill Tier Management
// Update Tiers
// update Product
export async function updateTiers(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { tierId, label, threshold } = data;

  const parsedThreshold = parseInt(threshold);
  try {
    const { databases } = await createAdminClient();

    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_TIERS,
      tierId,
      {
        label,
        threshold: parsedThreshold,
      }
    );

    revalidatePath("/", "layout");
    return { message: "Tier Updated Successfully", type: "success" };
  } catch (error) {
    return { message: error?.message, type: "error" };
  }
}

// create coupon

export async function createRewardCoupon(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { title, promoCode, pointsRequired, expiry, rewardType } = data;

  const parsedThreshold = parseInt(pointsRequired);
  try {
    const { databases } = await createAdminClient();

    await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_REWARDS,
      ID.unique(),
      {
        name: title,
        promoCode,
        rewardType,
        pointsRequired: parsedThreshold,
        expiry,
      }
    );

    revalidatePath("/", "layout");
    return { message: "Reward/Coupon Created Successfully", type: "success" };
  } catch (error) {
    return { message: error?.message, type: "error" };
  }
}

export async function updateQueryReply(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { queryId, reply } = data;
  try {
    const { databases } = await createAdminClient();

    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_QUERIES,
      queryId,
      {
        reply,
        status: "Read",
      }
    );

    revalidatePath("/", "layout");
    return { message: "Reply Submitted Successfully", type: "success" };
  } catch (error) {
    return { message: `${error?.message} ${queryId}`, type: "error" };
  }
}
export async function createQuery(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { userId, description, subject } = data;
  try {
    const { databases } = await createAdminClient();

    await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_QUERIES,
      ID.unique(),
      {
        user: userId,
        subject,
        description,
        status: "Unread",
      }
    );

    revalidatePath("/", "layout");
    return { message: "Query Submitted Successfully", type: "success" };
  } catch (error) {
    return { message: `${error?.message}`, type: "error" };
  }
}

// Registeration
export async function createNewUserRegistration(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { firstName, lastName, email, company, country, phone, referCode } =
    data;

  const password = generateReferralCode(firstName) + "_test";
  let user;
  try {
    const { users, account, databases } = await createAdminClient();

    let referredBy = null;

    if (referCode) {
      const { documents } = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_ID_USERS,
        [Query.contains("referralCode", referCode)]
      );

      referredBy = documents.length !== 0 ? documents[0].$id : null;
    }

    if (referCode && !referredBy) {
      return { message: "Invalid Invitation Code", type: "error" };
    } else if (referCode && referredBy) {
      // creates new auth user
      const newUserAccount = await account.create(
        ID.unique(),
        email,
        password,
        firstName
      );

      // sets prefs of the user
      await users.updateLabels(
        newUserAccount.$id, // userId
        ["user"] // prefs
      );

      //create document in users collection
      await databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_ID_USERS,
        newUserAccount.$id,
        {
          firstName,
          lastName,
          company,
          country,
          referralCode: generateReferralCode(firstName),
          isRefferedLead: true,
          refferedBy: referredBy,
          email,
          phone,
        }
      );
      //create document in leads collection
      await databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_ID_LEADS,
        ID.unique(),
        {
          referredBy: referredBy,
          users: newUserAccount.$id,
        }
      );

      //create document in points collection
      await databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_ID_POINTS,
        ID.unique(),
        {
          userId: referredBy,
          points: 100,
        }
      );

      await sendmail(email, firstName, password);

      return {
        message:
          "User Registered Successfully \n Your Friend Earned 100 Points",
        type: "success",
      };
    } else {
      // creates new auth user
      const newUserAccount = await account.create(
        ID.unique(),
        email,
        password,
        firstName
      );

      // sets prefs of the user
      await users.updateLabels(
        newUserAccount.$id, // userId
        ["user"] // prefs
      );

      //create document in users collection
      await databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_ID_USERS,
        newUserAccount.$id,
        {
          firstName,
          lastName,
          company,
          country,
          referralCode: generateReferralCode(firstName),
          isRefferedLead: false,
          refferedBy: null,
          email,
          phone,
        }
      );

      await sendmail(email, firstName, password);

      return { message: "User Registered Successfully", type: "success" };
    }
  } catch (error) {
    return { message: `${error?.message}`, type: "error" };
  }
}

// Update User Password
export async function UpdateUserPassword(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { newpwd, confirmpwd, userId } = data;

  try {
    const { users } = await createAdminClient();

    if (newpwd !== confirmpwd) {
      return { message: "Passwords Donot Match", type: "error" };
    } else {
      await users.updatePassword(userId, newpwd);
      return { message: "Password Updated Successfully", type: "success" };
    }
  } catch (error) {
    return { message: `${error?.message}`, type: "error" };
  }
}

export async function sendmail(email, user, pwd) {
  const resend = new Resend("re_Pn5pomA5_9w5UjrbBtz5McXQzzjfRbrgu");

  resend.emails.send({
    from: "storekwil@shabab.site",
    to: email,
    subject: `Welcome to StoreKwil`,
    html: `
      <h1>Welcome to StoreKwil!</h1>
      <p>Congratulations on registering on StoreKwil. We're excited to have you on board!</p>
      <p>You can log in to your dashboard using the credentials below:</p>
      <ul>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Password:</strong> ${pwd}</li>
      </ul>
      <p><a href="https://portal-storekwil.netlify.app/login" target="_blank">Click here to login to your dashboard</a></p>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <p>Happy shopping!</p>
      <p>The StoreKwil Team</p>
    `,
  });
}
export async function sendmails(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { subject, msg, emails } = data;

  // Convert it back into an array
  const recipientsArray = emails.split(",");

  const resend = new Resend("re_Pn5pomA5_9w5UjrbBtz5McXQzzjfRbrgu");

  try {
    const { data, error } = await resend.emails.send({
      from: "storekwil@shabab.site",
      to: recipientsArray,
      subject: subject,
      html: `
        <h1>Excited Offers from StoreKwil!</h1>
        <p>${msg}</p>
  
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Happy shopping!</p>
        <p>The StoreKwil Team</p>
      `,
    });

    if (error) {
      return { message: `${error?.message}`, type: "error" };
    }

    return { message: "Mail Sent Successfully", type: "success" };
  } catch (error) {
    return { message: `${error?.message}`, type: "error" };
  }
}

// Upload Marketing Material
export async function uploadMaterial(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { file } = data;

  try {
    const { storage } = await createAdminClient();

    // Upload File
    await storage.createFile(
      process.env.NEXT_PUBLIC_MARKETING_MATERIAL_STORAGE,
      ID.unique(),
      file
    );

    revalidatePath("/", "layout");
    return { message: "File Uploaded Successfully", type: "success" };
  } catch (error) {
    return { message: `${error?.message}`, type: "error" };
  }
}

// create Compaign
export async function createCompaign(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { title, reward, expiry, file } = data;

  const rewardPoints = parseInt(reward);

  try {
    const { storage, databases } = await createAdminClient();

    // Upload File
    const poster = await storage.createFile(
      process.env.NEXT_PUBLIC_POSTERS_STORAGE,
      ID.unique(),
      file
    );

    await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_COMPAIGNS,
      ID.unique(),
      {
        title,
        reward: rewardPoints,
        expiry,
        poster: poster.$id,
      }
    );

    revalidatePath("/", "layout");
    return { message: "Compaign Created Successfully", type: "success" };
  } catch (error) {
    return { message: `${error?.message}`, type: "error" };
  }
}

export async function updateCompaign(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { docID, expiry } = data;

  try {
    const { databases } = await createAdminClient();

    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_COMPAIGNS,
      docID,
      {
        expiry,
      }
    );

    revalidatePath("/", "layout");
    return { message: "Compaign Updated Successfully", type: "success" };
  } catch (error) {
    return { message: `${error?.message}`, type: "error" };
  }
}

// Delete Marketing Material
export async function deleteCompaign(formData) {
  const data = Object.fromEntries(formData);
  const { fileID, docID } = data;

  try {
    const { storage, databases } = await createAdminClient();

    // Delete File
    await storage.deleteFile(process.env.NEXT_PUBLIC_POSTERS_STORAGE, fileID);
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_COMPAIGNS,
      docID
    );

    revalidatePath("/", "layout");
    return { message: "File Deleted Successfully", type: "success" };
  } catch (error) {
    return { message: `${error?.message}`, type: "error" };
  }
}
// Delete Marketing Material
export async function deleteMaterial(formData) {
  const data = Object.fromEntries(formData);
  const { fileID } = data;

  try {
    const { storage } = await createAdminClient();

    // Delete File
    await storage.deleteFile(
      process.env.NEXT_PUBLIC_MARKETING_MATERIAL_STORAGE,
      fileID
    );

    revalidatePath("/", "layout");
    return { message: "File Deleted Successfully", type: "success" };
  } catch (error) {
    return { message: `${error?.message}`, type: "error" };
  }
}

export async function deleteReward(formData) {
  const data = Object.fromEntries(formData);
  const { fileID } = data;

  try {
    const { databases } = await createAdminClient();

    // Delete File
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_REWARDS,
      fileID
    );

    revalidatePath("/", "layout");
    return { message: "File Deleted Successfully", type: "success" };
  } catch (error) {
    return { message: `${error?.message}`, type: "error" };
  }
}
