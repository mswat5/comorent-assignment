export interface NewsSubmission {
  title: string;
  description: string;
  city: string;
  topic: string;
  publisherName: string;
  publisherPhone: string;
  image?: string;
}

export interface NewsItem {
  id: string;
  originalTitle: string;
  originalDescription: string;
  editedTitle: string;
  editedSummary: string;
  city: string;
  topic: string;
  publisherName: string;
  publisherPhone: string;
  image?: string;
  createdAt: string;
  isBookmarked?: boolean;
}

export const NEWS_TOPICS = [
  'Accident',
  'Festival',
  'Community Event',
  'Local Business',
  'Infrastructure',
  'Education',
  'Health',
  'Environment',
  'Sports',
  'Politics',
  'Other',
] as const;

export type NewsTopic = (typeof NEWS_TOPICS)[number];
