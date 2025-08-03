import { NewsSubmission } from "@/lib/types/news";

export const validateAndEditNews = async (submission: NewsSubmission) => {
  // Simulate API processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mock validation logic based on content
  const title = submission.title.toLowerCase();
  const description = submission.description.toLowerCase();

  // Reject obvious spam or inappropriate content
  const spamKeywords = [
    "spam",
    "fake",
    "scam",
    "buy now",
    "click here",
    "free money",
  ];
  const inappropriateKeywords = ["hate", "violence", "illegal"];

  const hasSpam = spamKeywords.some(
    (keyword) => title.includes(keyword) || description.includes(keyword)
  );

  const hasInappropriate = inappropriateKeywords.some(
    (keyword) => title.includes(keyword) || description.includes(keyword)
  );

  if (hasSpam) {
    return {
      isApproved: false,
      rejectionReason:
        "Content appears to be spam or promotional material. Please submit genuine local news.",
    };
  }

  if (hasInappropriate) {
    return {
      isApproved: false,
      rejectionReason:
        "Content contains inappropriate material that violates our community guidelines.",
    };
  }

  // Reject if description is too short (less than 50 characters)
  if (submission.description.length < 50) {
    return {
      isApproved: false,
      rejectionReason:
        "News description is too brief. Please provide more details about the event.",
    };
  }

  // Generate edited content for approved submissions
  const editedTitle = generateEditedTitle(
    submission.title,
    submission.topic,
    submission.city
  );
  const editedSummary = generateEditedSummary(
    submission.description,
    submission.city,
    submission.topic
  );

  return {
    isApproved: true,
    editedTitle,
    editedSummary,
  };
};

const generateEditedTitle = (
  originalTitle: string,
  topic: string,
  city: string
): string => {
  // Clean up the title and make it more news-like
  let editedTitle = originalTitle.trim();

  // Capitalize first letter of each word
  editedTitle = editedTitle.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );

  // Add context based on topic
  const topicPrefixes: Record<string, string> = {
    Accident: "Breaking:",
    Festival: "Local Event:",
    "Community Event": "Community:",
    "Local Business": "Business:",
    Infrastructure: "City Update:",
    Education: "Education:",
    Health: "Health Alert:",
    Environment: "Environmental:",
    Sports: "Sports:",
    Politics: "Local Politics:",
    Other: "Local News:",
  };

  const prefix = topicPrefixes[topic] || "Local News:";

  // Add prefix if not already present
  if (!editedTitle.startsWith(prefix)) {
    editedTitle = `${prefix} ${editedTitle}`;
  }

  // Ensure it's not too long
  if (editedTitle.length > 80) {
    editedTitle = editedTitle.substring(0, 77) + "...";
  }

  return editedTitle;
};

const generateEditedSummary = (
  originalDescription: string,
  city: string,
  topic: string
): string => {
  // Clean up the description
  let summary = originalDescription.trim();

  // Add location context if not mentioned
  if (!summary.toLowerCase().includes(city.toLowerCase())) {
    summary = `In ${city}, ${
      summary.charAt(0).toLowerCase() + summary.slice(1)
    }`;
  }

  // Ensure proper sentence structure
  if (
    !summary.endsWith(".") &&
    !summary.endsWith("!") &&
    !summary.endsWith("?")
  ) {
    summary += ".";
  }

  // Add editorial note
  const editorialNotes = [
    "This story has been reviewed and edited for clarity.",
    "Local authorities have been notified of this development.",
    "This is a developing story and updates will follow.",
    "Community members are encouraged to stay informed.",
    "This report has been verified by our editorial team.",
  ];

  const randomNote =
    editorialNotes[Math.floor(Math.random() * editorialNotes.length)];

  // Combine and ensure it's not too long
  let finalSummary = `${summary} ${randomNote}`;

  if (finalSummary.length > 200) {
    // Truncate the original summary to fit with the editorial note
    const maxOriginalLength = 200 - randomNote.length - 3; // -3 for " " and "..."
    summary = summary.substring(0, maxOriginalLength) + "...";
    finalSummary = `${summary} ${randomNote}`;
  }

  return finalSummary;
};
