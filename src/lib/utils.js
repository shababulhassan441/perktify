import { ID } from "node-appwrite";

export const formatCurrency = (amount) => {
  return (amount / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

export const formatCurrencytoEuro = (amount) => {
  return (amount / 100).toLocaleString("en-EU", {
    style: "currency",
    currency: "EUR",
  });
};

// export const formatDateToLocal = (
//   dateStr,
//   locale = 'en-US'
// ) => {
//   const date = new Date(dateStr);
//   const options = {
//     day: 'numeric',
//     month: 'short',
//     year: 'numeric',
//   };
//   const formatter = new Intl.DateTimeFormat(locale, options);
//   return formatter.format(date);
// };

export const formatEpochToLocal = (epochTime, locale = "en-US") => {
  const date = new Date(epochTime); // Convert epoch time to Date object

  // Format the date and time
  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true, // use 12-hour time format with AM/PM
  };

  const formatter = new Intl.DateTimeFormat(locale, options);

  return formatter.format(date);
};
export const formatDateToLocal = (dateStr, locale = "en-US") => {
  const date = new Date(dateStr);

  // Format the date and time
  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true, // use 12-hour time format with AM/PM
  };

  const formatter = new Intl.DateTimeFormat(locale, options);

  return formatter.format(date);
};

export const formatMinutes = (totalMinutes) => {
  if (totalMinutes < 0) {
    throw new Error("Minutes cannot be negative");
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  let formattedTime = "";

  if (hours > 0) {
    formattedTime += `${hours} h`;
  }

  if (minutes > 0) {
    if (hours > 0) {
      formattedTime += " ";
    }
    formattedTime += `${minutes} min`;
  }

  return formattedTime || "0 min";
};

export const generatePagination = (currentPage, totalPages) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

export const calculateNextTimestamp = (createdAt, durationInMinutes) => {
  // Parse the createdAt timestamp
  const createdDate = new Date(createdAt);

  // Add the duration in milliseconds (1 minute = 60000 milliseconds)
  const nextDate = new Date(createdDate.getTime() + durationInMinutes * 60000);

  // Format the next date in the desired ISO string format
  return formatDateToLocal(nextDate.toISOString());
};

export const parseDuration = (value, unit) => {
  switch (unit) {
    case "minutes":
      return value; // Already in minutes
    case "hours":
      return value * 60; // Convert hours to minutes
    case "days":
      return value * 24 * 60; // Convert days to minutes
    default:
      return 0; // Fallback
  }
};

export function parsedMinutes(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return { durationValue: hours, durationType: "hours" };
  } else {
    return { durationValue: remainingMinutes, durationType: "minutes" };
  }
}

export function parseCentsToEuros(cents) {
  const euros = Math.floor(cents / 100);
  const remainingCents = Math.floor((cents % 100) / 10);

  // Format the output as "dollars,cents" or just "dollars" if remaining cents is 0
  return remainingCents > 0 ? `${euros},${remainingCents}` : `${euros}`;
}

export function getMostFrequentProperty(tickets) {
  return new Promise((resolve) => {
    const propertyCounts = {};

    // Count occurrences of each property
    tickets.forEach((ticket) => {
      const prop = ticket.property.$id;
      propertyCounts[prop] = (propertyCounts[prop] || 0) + 1;
    });

    // Debug: Log the counts
    // console.log("Property Counts:", propertyCounts);

    // Find the property with the highest count
    let maxCount = 0;
    let mostFrequentProperty = null;

    for (const [prop, count] of Object.entries(propertyCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostFrequentProperty = prop;
      }
    }

    // Debug: Log the most frequent property
    // console.log("Most Frequent Property:", mostFrequentProperty);

    // Resolve the promise with the most frequent property
    resolve(mostFrequentProperty);
  });
}



export const generateYAxis = (registrations) => {
  // Calculate what labels we need to display on the y-axis
  // based on the highest registration count, in steps of 10.
  const yAxisLabels = [];
  const highestRecord = Math.max(...registrations.map((month) => month.userRegistrations));
  const topLabel = Math.ceil(highestRecord / 10) * 10;

  for (let i = topLabel; i >= 0; i -= 10) {
    yAxisLabels.push(`${i}`);
  }

  return { yAxisLabels, topLabel };
};


export function generateReferralCode(firstName) {
  const initials = firstName.slice(0, 4).toUpperCase(); // Get up to 4 initials from the first name
  const randomNumber = ID.unique(); // Generate a random 16-character string
  const digits = randomNumber.replace(/\D/g, '').slice(0, 4); // Extract up to 4 digits from the random string

  // Ensure the referral code is exactly 8 characters long
  const paddedDigits = digits.padEnd(4, '0'); // Pad with zeros if less than 4 digits
  return (initials + paddedDigits).slice(0, 8); // Combine and trim to 8 characters
}

export const formatSizeBytes = (bytes, decimals = 1) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;

};

export function maskEmail(email) {
  const [localPart, domain] = email.split("@");
  const maskedLocalPart = localPart.substring(0, 2) + "*****";
  const maskedDomain = domain.replace(/^(.*)(\..*)$/, "*****$2");
  return `${maskedLocalPart}@${maskedDomain}`;
}