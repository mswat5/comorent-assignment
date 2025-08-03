export interface NewsSubmission {
  title: string;
  description: string;
  city: string;
  topic: string;
  publisherName: string;
  publisherPhone: string;
  imageUri?: string;
}

export interface PublishedNews {
  id: string;
  originalTitle: string;
  originalDescription: string;
  editedTitle: string;
  editedSummary: string;
  city: string;
  topic: string;
  publisherName: string;
  maskedPhone: string;
  imageUri?: string;
  timestamp: number;
  isBookmarked?: boolean;
}

export interface AIValidationResult {
  isValid: boolean;
  reason?: string;
  editedTitle?: string;
  editedSummary?: string;
}

export const NEWS_TOPICS = [
  "Accident",
  "Festival",
  "Community Event",
  "Traffic",
  "Weather",
  "Sports",
  "Politics",
  "Business",
  "Education",
  "Healthcare",
] as const;

export type NewsTopic = (typeof NEWS_TOPICS)[number];
