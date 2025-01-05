import { createAdminClient, createSessionClient, storekwilAdminClient } from "@/appwrite/config";
import { cookies } from "next/headers";
import { Query } from "node-appwrite";
import { formatCurrency } from "./utils";
import auth from "./auth";

// export async function fetchSellerListings(query, currentPage) {
//   const ITEMS_PER_PAGE = 5;
//   const offset = (currentPage - 1) * ITEMS_PER_PAGE;
//   const sessionCookie = cookies().get("session");

//   try {
//     const user = await auth.getUser();
//     const { databases } = await createSessionClient(sessionCookie.value);
//     // const { documents,total } = await databases.listDocuments(
//     //     process.env.NEXT_PUBLIC_DATABASE_ID,
//     //     process.env.NEXT_PUBLIC_COLLECTION_ID_PROPERTIES
//     // );
//     const { documents } = await databases.listDocuments(
//       process.env.NEXT_PUBLIC_DATABASE_ID,
//       process.env.NEXT_PUBLIC_COLLECTION_ID_PROPERTIES,
//       [
//         Query.contains("name", query),
//         Query.limit(ITEMS_PER_PAGE),
//         Query.offset(offset),
//         Query.equal("user", user.$id),
//       ]
//     );
//     return documents;
//   } catch (error) {
//     console.error("ERROR in fetchSellerListings", error);
//     return;
//   }
// }
// export async function fetchAllListings(query, currentPage) {
//   const ITEMS_PER_PAGE = 5;
//   const offset = (currentPage - 1) * ITEMS_PER_PAGE;

//   try {
//     const { databases } = await createAdminClient();

//     const { documents } = await databases.listDocuments(
//       process.env.NEXT_PUBLIC_DATABASE_ID,
//       process.env.NEXT_PUBLIC_COLLECTION_ID_PROPERTIES,
//       [
//         Query.contains("name", query),
//         Query.limit(ITEMS_PER_PAGE),
//         Query.offset(offset),
//       ]
//     );
//     return documents;
//   } catch (error) {
//     console.error("ERROR in fetchAllListings", error);
//     return;
//   }
// }

// export async function fetchAllSellers(query, currentPage) {
//   const ITEMS_PER_PAGE = 10;
//   const offset = (currentPage - 1) * ITEMS_PER_PAGE;

//   try {
//     const { users } = await createAdminClient();

//     const response = await users.list([
//       Query.contains("name", query),
//       Query.limit(ITEMS_PER_PAGE),
//       Query.offset(offset),
//       Query.contains("labels", ["seller"]), // Exclude admin users
//     ]);
//     return response.users;
//   } catch (error) {
//     console.error("ERROR in fetchAllSellers", error);
//     return;
//   }
// }

// export async function fetchAllSellersCount(query) {
//   const ITEMS_PER_PAGE = 10;

//   try {
//     const { users } = await createAdminClient();
//     const { total } = await users.list([
//       Query.contains("name", query),
//       Query.contains("labels", ["seller"]), // Exclude admin users
//     ]);

//     const totalPages = Math.ceil(Number(total) / ITEMS_PER_PAGE);
//     return totalPages;
//   } catch (error) {
//     console.error("ERROR in fetchAllSellersCount", error);
//     return;
//   }
// }
// export async function fetchAllListingsCount(query) {
//   const ITEMS_PER_PAGE = 5;

//   try {
//     const { databases } = await createAdminClient();
//     const { total } = await databases.listDocuments(
//       process.env.NEXT_PUBLIC_DATABASE_ID,
//       process.env.NEXT_PUBLIC_COLLECTION_ID_PROPERTIES,
//       [Query.contains("name", query)]
//     );

//     const totalPages = Math.ceil(Number(total) / ITEMS_PER_PAGE);
//     return totalPages;
//   } catch (error) {
//     console.error("ERROR in fetchAllListingsCount", error);
//     return;
//   }
// }
// export async function fetchSellerListingsCount(query) {
//   const ITEMS_PER_PAGE = 5;
//   const sessionCookie = cookies().get("session");

//   try {
//     const user = await auth.getUser();
//     const { databases } = await createSessionClient(sessionCookie.value);
//     const { total } = await databases.listDocuments(
//       process.env.NEXT_PUBLIC_DATABASE_ID,
//       process.env.NEXT_PUBLIC_COLLECTION_ID_PROPERTIES,
//       [Query.contains("name", query), Query.equal("user", user.$id)]
//     );

//     const totalPages = Math.ceil(Number(total) / ITEMS_PER_PAGE);
//     return totalPages;
//   } catch (error) {
//     console.error("ERROR in fetchSellerListings", error);
//     return;
//   }
// }

// export async function fetchSellerDetails(sellerId) {
//   const sessionCookie = cookies().get("session");

//   try {
//     const { databases } = await createSessionClient(sessionCookie.value);
//     const userDetails = await databases.getDocument(
//       process.env.NEXT_PUBLIC_DATABASE_ID,
//       process.env.NEXT_PUBLIC_COLLECTION_ID_USERS,
//       sellerId
//     );
//     return userDetails;
//   } catch (error) {
//     console.error("ERROR in fetchSellerDetails", error);
//     return;
//   }
// }

// export async function fetchListingDetails(listingId) {
//   try {
//     const { databases } = await createAdminClient();
//     const listingDetails = await databases.getDocument(
//       process.env.NEXT_PUBLIC_DATABASE_ID,
//       process.env.NEXT_PUBLIC_COLLECTION_ID_PROPERTIES,
//       listingId
//     );
//     return listingDetails;
//   } catch (error) {
//     console.error("ERROR in fetchListingDetails", error);
//     return;
//   }
// }

// export async function fetchProductDetails(productId) {
//   try {
//     const { databases } = await createAdminClient();
//     const productDetails = await databases.getDocument(
//       process.env.NEXT_PUBLIC_DATABASE_ID,
//       process.env.NEXT_PUBLIC_COLLECTION_ID_PRODUCTS,
//       productId
//     );
//     return productDetails;
//   } catch (error) {
//     console.error("ERROR in fetchProductDetails", error);
//     return;
//   }
// }

// export async function fetchStripeConnectedLinkedStatus(sellerId) {
//   try {
//     const { users } = await createAdminClient();
//     const StripeConnectedLinkedStatus = await users.getPrefs(sellerId);
//     return {
//       stripeConnectedLinked: StripeConnectedLinkedStatus?.stripeConnectedLinked,
//       valid: true,
//     };
//   } catch (error) {
//     console.error("ERROR in fetchStripeConnectedLinkedStatus", error);
//     return { stripeConnectedLinked: false, valid: false };
//   }
// }
// export async function fetchTicket(ticketID) {
//   try {
//     const { databases } = await createAdminClient();
//     const ticket = await databases.getDocument(
//       process.env.NEXT_PUBLIC_DATABASE_ID,
//       process.env.NEXT_PUBLIC_COLLECTION_ID_TICKETS,
//       ticketID
//     );
//     return { ticket, valid: true };
//   } catch (error) {
//     console.error("ERROR in fetchTicket", error);
//     return { ticket: false, valid: false };
//   }
// }

// export async function fetchBestSelling() {
//   try {
//     const { databases } = await createAdminClient();

//     const { documents: tickets } = await databases.listDocuments(
//       process.env.NEXT_PUBLIC_DATABASE_ID,
//       process.env.NEXT_PUBLIC_COLLECTION_ID_TICKETS
//     );

//     const bestsellinglistingID = await getMostFrequentProperty(tickets);
//     const bestselling = await databases.getDocument(
//       process.env.NEXT_PUBLIC_DATABASE_ID,
//       process.env.NEXT_PUBLIC_COLLECTION_ID_PROPERTIES,
//       bestsellinglistingID
//     );
//     return bestselling;
//   } catch (error) {
//     console.error("ERROR in fetchBestSelling", error);
//     return;
//   }
// }

// storekwil
// Admin Point of View

// Admin Point of View

export async function fetchCardDataCases() {
  try {
    const { databases } = await createAdminClient();

    const [
      pendingCount,
      reviewCount,
      assignedCount,
      approvedCount,
      declinedCount,
      wonCount,
      lostCount,
    ] = await Promise.all([
      databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_ID_CASES,
        [Query.contains("status", "pending")]
      ),
      databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_ID_CASES,
        [Query.contains("status", "review")]
      ),
      databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_ID_CASES,
        [Query.contains("status", "assigned")]
      ),
      databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_ID_CASES,
        [Query.contains("status", "approved")]
      ),
      databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_ID_CASES,
        [Query.contains("status", "declined")]
      ),
      databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_ID_CASES,
        [Query.contains("status", "won")]
      ),
      databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_ID_CASES,
        [Query.contains("status", "lost")]
      ),
    ]);

    const pending = pendingCount?.total ?? 0;
    const review = reviewCount?.total ?? 0;
    const assigned = assignedCount?.total ?? 0;
    const approved = approvedCount?.total ?? 0;
    const declined = declinedCount?.total ?? 0;
    const won = wonCount?.total ?? 0;
    const lost = lostCount?.total ?? 0;
    return {
      pending,
      review,
      assigned,
      approved,
      declined,
      won,
      lost,
    };
  } catch (error) {
    console.error("fetchAdminCardData:", error);
  }
}

// Cases Data Count
// export async function fetchAllCasesCount(query) {
//   const ITEMS_PER_PAGE = 5;

//   try {
//     const { databases } = await createAdminClient();
//     const { total } = await databases.listDocuments(
//       process.env.NEXT_PUBLIC_DATABASE_ID,
//       process.env.NEXT_PUBLIC_COLLECTION_ID_CASES,
//       [Query.contains("status", query)]
//     );

//     const totalPages = Math.ceil(Number(total) / ITEMS_PER_PAGE);
//     return totalPages;
//   } catch (error) {
//     console.error("ERROR in fetchAllCasesCount", error);
//     return;
//   }
// }

export async function fetchAllCases(query, currentPage) {
  const ITEMS_PER_PAGE = 5;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const { databases } = await createAdminClient();

    const { documents } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_CASES,
      [
        Query.contains("status", query),
        Query.limit(ITEMS_PER_PAGE),
        Query.offset(offset),
      ]
    );
    return documents;
  } catch (error) {
    console.error("ERROR in fetchAllCases", error);
    return;
  }
}

export async function fetchPlatforms() {
  try {
    const { databases } = await createAdminClient();

    const { documents } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_PLATFORM
    );
    return documents;
  } catch (error) {
    console.error("ERROR in fetchPlatforms", error);
    return;
  }
}

export async function fetchProfileHandles() {
  try {
    const { databases } = await createAdminClient();

    const { documents } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_PROFILE
    );
    return documents;
  } catch (error) {
    console.error("ERROR in fetchProfileHandles", error);
    return;
  }
}

export async function fetchPerpetrators() {
  try {
    const { databases } = await createAdminClient();
    const { documents: Perpetrators } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_PERPETRATOR
    );
    return Perpetrators;
  } catch (error) {
    console.error("ERROR in fetchPerpetrators", error);
    return;
  }
}

// export async function fetchCaseDetails(caseId) {
//   try {
//     const { databases } = await createAdminClient();
//     const caseDetails = await databases.getDocument(
//       process.env.NEXT_PUBLIC_DATABASE_ID,
//       process.env.NEXT_PUBLIC_COLLECTION_ID_CASES,
//       caseId
//     );
//     return caseDetails;
//   } catch (error) {
//     console.error("ERROR in fetchCaseDetails", error);
//     return;
//   }
// }

// export async function fetchUserDetails(userId) {
//   try {
//     const { users } = await createAdminClient();
//     const response = await users.get(userId);
//     return response;
//   } catch (error) {
//     // console.error("ERROR in fetchUserDetails", error);
//     return;
//   }
// }
export async function fetchPerpetratorDetails(userId) {
  try {
    const { databases } = await createAdminClient();
    const PerpetratorDetails = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_PERPETRATOR,
      userId
    );
    return PerpetratorDetails;
  } catch (error) {
    console.error("ERROR in fetchPerpetratorDetails", error);
    return;
  }
}

export async function fetchAllUserCasesCount(query) {
  const ITEMS_PER_PAGE = 5;

  const sessionCookie = cookies().get("session");

  try {
    const { databases } = await createSessionClient(sessionCookie.value);
    const { total } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_CASES,
      [Query.contains("status", query)]
    );

    const totalPages = Math.ceil(Number(total) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("ERROR in fetchAllUserCasesCount", error);
    return;
  }
}

export async function fetchAllUserCases(query, currentPage) {
  const ITEMS_PER_PAGE = 5;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const sessionCookie = cookies().get("session");

  try {
    const { databases, account } = await createSessionClient(
      sessionCookie.value
    );
    const user = await account.get();
    const isLawyer = user.labels?.[0] === "lawyer";

    if (isLawyer) {
      const { documents } = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_ID_CASES,
        [
          Query.contains("status", query),
          Query.contains("lawyer", user.$id),
          Query.limit(ITEMS_PER_PAGE),
          Query.offset(offset),
        ]
      );
      return documents;
    } else {
      const { documents } = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_ID_CASES,
        [
          Query.contains("status", query),
          Query.limit(ITEMS_PER_PAGE),
          Query.offset(offset),
        ]
      );
      return documents;
    }
  } catch (error) {
    console.error("ERROR in fetchAllUserCases", error);
    return;
  }
}

export async function fetchRestrictedCaseDetails(caseId) {
  const sessionCookie = cookies().get("session");

  try {
    const { databases, account } = await createSessionClient(
      sessionCookie.value
    );
    const user = await account.get();
    const isLawyer = user.labels?.[0] === "lawyer";

    const caseDetails = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_CASES,
      caseId
    );

    if (!isLawyer) {
      return caseDetails;
    } else if (isLawyer && caseDetails.lawyer === user.$id) {
      return caseDetails;
    } else {
      return null;
    }
  } catch (error) {
    console.error("ERROR in fetchRestrictedCaseDetails", error);
    return;
  }
}

export async function fetchAllLabelledUsers(query) {
  try {
    const { users } = await createAdminClient();

    const response = await users.list([Query.contains("labels", [query])]);
    return response.users;
  } catch (error) {
    console.error("ERROR in fetchAllLabelledUsers", error);
    return;
  }
}

// Storekwill Admin Functions
export async function fetchAdminCardData() {
  try {
    const documents = await fetchAllUsers();

    // Calculate values with fallback to zero if empty
    const users = documents.length || 0;

    const direct = documents.filter((user) => !user.isRefferedLead).length || 0;

    const referred =
      documents.filter((user) => user.isRefferedLead).length || 0;

    const currentMonth = new Date().getMonth();
    const monthly =
      documents.filter((user) => {
        const createdAt = new Date(user.$createdAt);
        return createdAt.getMonth() === currentMonth;
      }).length || 0;

    return {
      users,
      direct,
      referred,
      monthly,
    };
  } catch (error) {
    console.error("fetchAdminCardData:", error);
    return {
      users: 0,
      direct: 0,
      referred: 0,
      monthly: 0,
    };
  }
}
export async function fetchLeadsAnalytics() {
  try {
    const documents = await fetchAllUsers();

    // Initialize an object to store registration counts for each month
    const monthlyData = {
      Jan: 0,
      Feb: 0,
      Mar: 0,
      Apr: 0,
      May: 0,
      Jun: 0,
      Jul: 0,
      Aug: 0,
      Sep: 0,
      Oct: 0,
      Nov: 0,
      Dec: 0,
    };

    // Populate monthlyData with the number of registrations per month
    documents.forEach((user) => {
      const createdAt = new Date(user.$createdAt);
      const month = createdAt.toLocaleString("en-US", { month: "short" });
      if (monthlyData[month] !== undefined) {
        monthlyData[month]++;
      }
    });

    // Convert monthlyData object to the desired array format
    const analyticsData = Object.entries(monthlyData).map(
      ([month, userRegistrations]) => ({
        month,
        userRegistrations,
      })
    );

    return analyticsData;
  } catch (error) {
    console.error("Error fetching leads analytics:", error);
    throw new Error("Failed to fetch leads analytics.");
  }
}
export async function fetchLatestRegistrations() {
  try {
    const { databases } = await createAdminClient();

    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_USERS,
      [Query.limit(5)]
    );
    return response.documents;
  } catch (error) {
    console.error("ERROR in fetchAllUsers", error);
    return;
  }
}
// User Management
// export async function fetchAllUsers(filters = {}) {
//   const { query, queryType } = filters;

//   try {
//     const { users, databases } = await createAdminClient();
//     if(query==="" || queryType===""){
//       const response = await databases.listDocuments(
//         process.env.NEXT_PUBLIC_DATABASE_ID,
//         process.env.NEXT_PUBLIC_COLLECTION_ID_USERS
//       );
//       return response.documents;
//     }else{
//       const response = await databases.listDocuments(
//         process.env.NEXT_PUBLIC_DATABASE_ID,
//         process.env.NEXT_PUBLIC_COLLECTION_ID_USERS,
//         [ Query.contains(queryType, query)]
//       );
//       return response.documents;
//     }
//   } catch (error) {
//     console.error("ERROR in fetchAllUsers", error);
//     return;
//   }
// }
// Teir Management
export async function fetchAllTiers() {
  try {
    const { users, databases } = await createAdminClient();

    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_TIERS
    );
    return response.documents;
  } catch (error) {
    console.error("ERROR in fetchAllTiers", error);
    return;
  }
}
// Rewards Management
export async function fetchAllRewards() {
  try {
    const { users, databases } = await createAdminClient();

    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_REWARDS
    );
    return response.documents;
  } catch (error) {
    console.error("ERROR in fetchAllRewards", error);
    return;
  }
}

// Marrketing Material Mannagement
export async function fetchAllMaterials() {
  try {
    const { storage } = await createAdminClient();

    const response = await storage.listFiles(
      process.env.NEXT_PUBLIC_MARKETING_MATERIAL_STORAGE
    );

    return response.files;
  } catch (error) {
    console.error("ERROR in fetchAllMaterials", error);
    return;
  }
}

// Transactions History Management
export async function fetchAllTransactions() {
  try {
    const { users, databases } = await createAdminClient();

    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_TRANSACTIONS
    );
    return response.documents;
  } catch (error) {
    console.error("ERROR in fetchAllTransactions", error);
    return;
  }
}
// Queries Managemnet History Management
export async function fetchAllQueries() {
  try {
    const { users, databases } = await createAdminClient();

    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_QUERIES
    );
    return response.documents;
  } catch (error) {
    console.error("ERROR in fetchAllQueries", error);
    return;
  }
}
// Compaigns Managemnet History Management
export async function fetchAllCompaigns() {
  try {
    const { users, databases } = await createAdminClient();

    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_COMPAIGNS
    );
    return response.documents;
  } catch (error) {
    console.error("ERROR in fetchAllCompaigns", error);
    return;
  }
}


//Storekwill user function
export async function fetchUserCardData() {
  try {
    const userDetail = await fetchUserDetails();

    // Calculate total earned points by summing up all points in earnedPoints array
    const points = userDetail.earnedPoints.reduce(
      (total, entry) => total + entry.points,
      0
    );

    // Calculate used points by summing up all points used in transactions
    const used = userDetail.transactions.reduce((total, transaction) => {
      return total + (transaction.coupon?.pointsRequired || 0);
    }, 0);

    // Calculate available points as total earned points minus used points
    const available = points - used;

    // Calculate the number of leads referred by the user
    const leads = userDetail.lead ? userDetail.lead.length : 0;

    return {
      points,
      leads,
      available,
      used,
    };
  } catch (error) {
    console.error("fetchUserCardData:", error);
    return {
      points: 0,
      leads: 0,
      available: 0,
      used: 0,
    };
  }
}
//Storekwill user function
export async function fetchUserInsights(userId) {
  try {
    const { databases } = await createAdminClient();

    const userDetail = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_USERS,
      userId
    );

    // Calculate total earned points by summing up all points in earnedPoints array
    const points = userDetail.earnedPoints.reduce(
      (total, entry) => total + entry.points,
      0
    );

    // Calculate used points by summing up all points used in transactions
    const used = userDetail.transactions.reduce((total, transaction) => {
      return total + (transaction.coupon?.pointsRequired || 0);
    }, 0);

    // Calculate available points as total earned points minus used points
    const available = points - used;

    // Calculate the number of leads referred by the user
    const leads = userDetail.lead ? userDetail.lead.length : 0;

    return {
      points,
      leads,
      available,
      used,
    };
  } catch (error) {
    console.error("fetchUserCardData:", error);
    return {
      points: 0,
      leads: 0,
      available: 0,
      used: 0,
    };
  }
}
export async function fetchUserLeadsAnalytics() {
  try {
    const userDetail = await fetchUserDetails();

    // Initialize an object to store lead counts for each month
    const monthlyData = {
      Jan: 0,
      Feb: 0,
      Mar: 0,
      Apr: 0,
      May: 0,
      Jun: 0,
      Jul: 0,
      Aug: 0,
      Sep: 0,
      Oct: 0,
      Nov: 0,
      Dec: 0,
    };

    // Check if userDetail has a leads array and populate monthlyData with lead counts per month
    if (userDetail.lead && Array.isArray(userDetail.lead)) {
      userDetail.lead.forEach((lead) => {
        const createdAt = new Date(lead.$createdAt);
        const month = createdAt.toLocaleString("en-US", { month: "short" });
        if (monthlyData[month] !== undefined) {
          monthlyData[month]++;
        }
      });
    }

    // Convert monthlyData object to the desired array format
    const analyticsData = Object.entries(monthlyData).map(
      ([month, userRegistrations]) => ({
        month,
        userRegistrations,
      })
    );

    return analyticsData;
  } catch (error) {
    console.error("Error fetching leads analytics:", error);
    throw new Error("Failed to fetch leads analytics.");
  }
}

export async function fetchUserLatestRegistrations() {
  try {
    const userDetail = await fetchUserDetails();

    // Sort the leads by creation date in descending order and take the first 5 entries
    const latestLeads = userDetail.lead
      .sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt))
      .slice(0, 5)
      .map((lead) => lead.users);

    return latestLeads;
  } catch (error) {
    console.error("ERROR in fetchUserLatestRegistrations", error);
    return [];
  }
}
export async function fetchUserAllLeads(userId) {
  try {
    const { databases } = await createAdminClient();

    const userDetail = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_USERS,
      userId
    );

    // Sort the leads by creation date in descending order and take the first 5 entries
    const latestLeads = userDetail.lead
      .sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt))
      .map((lead) => lead.users);

    return latestLeads;
  } catch (error) {
    console.error("ERROR in fetchUserLatestRegistrations", error);
    return [];
  }
}

export async function fetchUserDetails() {
  try {
    const { users, databases } = await createAdminClient();

    const user = await auth.getUser();

    const response = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_USERS,
      user.$id
    );
    return response;
  } catch (error) {
    console.error("ERROR in fetchUserDetails", error);
    return;
  }
}

export async function fetchUserLevel() {
  try {
    const userDetail = await fetchUserDetails();
    const tiers = await fetchAllTiers();

    // Calculate the user's total points
    const totalPoints = userDetail.earnedPoints.reduce(
      (sum, entry) => sum + entry.points,
      0
    );

    // Sort tiers by threshold in ascending order
    const sortedTiers = tiers.sort((a, b) => a.threshold - b.threshold);

    // Determine the user's level based on their total points
    let userLevel = "No Level";
    for (const tier of sortedTiers) {
      if (totalPoints >= tier.threshold) {
        userLevel = tier.label;
      } else {
        break; // Stop if the next threshold is higher than the total points
      }
    }

    // Determine the user's level index based on their total points
    let levelIndex = -1;
    for (let i = 0; i < sortedTiers.length; i++) {
      if (totalPoints >= sortedTiers[i].threshold) {
        levelIndex = i;
      } else {
        break; // Stop if the next threshold is higher than the total points
      }
    }

    const labels = tiers.map((tier) => tier.label);

    return {
      points: totalPoints,
      level: levelIndex + 1,
      labels,
      tiers,
      code: userDetail.referralCode,
    };
  } catch (error) {
    console.error("ERROR in fetchUserLevel", error);
    return { points: 0, level: "No Level" };
  }
}
export async function fetchUserInsightsLevel(userId) {
  try {
    const { databases } = await createAdminClient();

    const userDetail = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_USERS,
      userId
    );
    const tiers = await fetchAllTiers();

    // Calculate the user's total points
    const totalPoints = userDetail.earnedPoints.reduce(
      (sum, entry) => sum + entry.points,
      0
    );

    // Sort tiers by threshold in ascending order
    const sortedTiers = tiers.sort((a, b) => a.threshold - b.threshold);

    // Determine the user's level based on their total points
    let userLevel = "No Level";
    for (const tier of sortedTiers) {
      if (totalPoints >= tier.threshold) {
        userLevel = tier.label;
      } else {
        break; // Stop if the next threshold is higher than the total points
      }
    }

    // Determine the user's level index based on their total points
    let levelIndex = -1;
    for (let i = 0; i < sortedTiers.length; i++) {
      if (totalPoints >= sortedTiers[i].threshold) {
        levelIndex = i;
      } else {
        break; // Stop if the next threshold is higher than the total points
      }
    }

    const labels = tiers.map((tier) => tier.label);

    return {
      points: totalPoints,
      level: levelIndex + 1,
      labels,
      tiers,
      code: userDetail.referralCode,
      userDetail: userDetail,
    };
  } catch (error) {
    console.error("ERROR in fetchUserLevel", error);
    return { points: 0, level: "No Level" };
  }
}

export async function fetchAllUsers(filters = {}) {
  const {
    query = "",
    queryType = "",
    dateFilterType,
    dateStart,
    dateEnd,
    pointsFilterType,
    pointsMin,
    pointsMax,
    pointsValue,
    order = "asc",
    limit = 25,
    offset = 0,
  } = filters;

  try {
    const { users, databases } = await createAdminClient();
    const queryFilters = [];

    // Query by text and type
    if (query && queryType) {
      queryFilters.push(Query.contains(queryType, query));
    }

    // Date filtering
    if (dateFilterType === "range" && dateStart && dateEnd) {
      queryFilters.push(
        Query.between(
          "$createdAt",
          new Date(dateStart).toISOString(),
          new Date(dateEnd).toISOString()
        )
      );
    } else if (dateFilterType === "dateAfter" && dateStart) {
      queryFilters.push(
        Query.greaterThan("$createdAt", new Date(dateStart).toISOString())
      );
    } else if (dateFilterType === "dateBefore" && dateStart) {
      queryFilters.push(
        Query.lessThan("$createdAt", new Date(dateStart).toISOString())
      );
    }


    // // Ordering
    // const orderQuery =
    //   order === "desc"
    //     ? Query.orderDesc("$createdAt")
    //     : Query.orderAsc("$createdAt");
    // queryFilters.push(orderQuery);

    // // Pagination
    // queryFilters.push(Query.limit(limit));
    // queryFilters.push(Query.offset(offset));

    // console.log("queryFilters",queryFilters)

    // Fetch the documents with filters
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_USERS,
      queryFilters
    );
    // Calculate totalPoints and append to each document
    response.documents.forEach((doc) => {
      const totalPoints = doc.earnedPoints.reduce(
        (sum, entry) => sum + entry.points,
        0
      );
      doc.totalPoints = totalPoints;
    });

    // Apply filters to the computed totalPoints
    let filteredDocuments = response.documents;

    if (pointsFilterType === "range" && pointsMin && pointsMax) {
      filteredDocuments = filteredDocuments.filter(
        (doc) => doc.totalPoints >= pointsMin && doc.totalPoints <= pointsMax
      );
    } else if (pointsFilterType === "pointsGreaterThan" && pointsValue) {
      filteredDocuments = filteredDocuments.filter(
        (doc) => doc.totalPoints > pointsValue
      );
    } else if (pointsFilterType === "pointsLessThan" && pointsValue) {
      filteredDocuments = filteredDocuments.filter(
        (doc) => doc.totalPoints < pointsValue
      );
    } else if (pointsFilterType === "pointsEqual" && pointsValue) {
      filteredDocuments = filteredDocuments.filter(
        (doc) => doc.totalPoints === pointsValue
      );
    }

    return filteredDocuments;

    // return response.documents;
  } catch (error) {
    console.error("ERROR in fetchAllUsers", error);
    return [];
  }
}



export async function fetchAllWaitlistUsers(filters = {}) {
  const {
    query = "",
    queryType = "",
    dateFilterType,
    dateStart,
    dateEnd,
    pointsFilterType,
    pointsMin,
    pointsMax,
    pointsValue,
    order = "asc",
    limit = 25,
    offset = 0,
  } = filters;

  try {
    const {  databases } = await storekwilAdminClient();
    const queryFilters = [];

    // Query by text and type
    if (query && queryType) {
      queryFilters.push(Query.contains(queryType, query));
    }

    // Date filtering
    if (dateFilterType === "range" && dateStart && dateEnd) {
      queryFilters.push(
        Query.between(
          "$createdAt",
          new Date(dateStart).toISOString(),
          new Date(dateEnd).toISOString()
        )
      );
    } else if (dateFilterType === "dateAfter" && dateStart) {
      queryFilters.push(
        Query.greaterThan("$createdAt", new Date(dateStart).toISOString())
      );
    } else if (dateFilterType === "dateBefore" && dateStart) {
      queryFilters.push(
        Query.lessThan("$createdAt", new Date(dateStart).toISOString())
      );
    }

    // Fetch the documents with filters
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_STOREKWIL_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_WAITLIST,
      queryFilters
    );


    return response.documents;
  } catch (error) {
    console.error("ERROR in fetchAllWaitlistUsers", error);
    return [];
  }
}
