import { NewsSubmission, PublishedNews } from "@/lib/types/news";
import { MockAIService } from "@/lib/utils/aiService";
import { StorageService } from "@/lib/utils/storage";
import { create } from "zustand";

interface NewsState {
  news: PublishedNews[];
  bookmarks: string[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadNews: () => Promise<void>;
  submitNews: (submission: NewsSubmission) => Promise<boolean>;
  toggleBookmark: (newsId: string) => Promise<void>;
  clearError: () => void;
}

export const useNewsStore = create<NewsState>((set, get) => ({
  news: [],
  bookmarks: [],
  isLoading: false,
  error: null,

  loadNews: async () => {
    try {
      const [news, bookmarks] = await Promise.all([
        StorageService.loadNews(),
        StorageService.loadBookmarks(),
      ]);

      const newsWithBookmarksStatus = news.map((item) => ({
        ...item,
        isBookmarked: bookmarks.includes(item.id),
      }));

      set({ news: newsWithBookmarksStatus, bookmarks });
    } catch (error) {
      set({ error: "Failed to load news" });
    }
  },

  submitNews: async (submission: NewsSubmission): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      const result = await MockAIService.validateAndEdit(submission);
      if (!result.isValid) {
        set({
          error: result.reason || "Content rejected by AI validation",
          isLoading: false,
        });
        return false;
      }
      const publishedNews: PublishedNews = {
        id: Date.now().toString(),
        originalTitle: submission.title,
        originalDescription: submission.description,
        editedTitle: result.editedTitle!,
        editedSummary: result.editedSummary!,
        city: submission.city,
        topic: submission.topic,
        publisherName: submission.publisherName,
        maskedPhone: StorageService.maskPhoneNumber(submission.publisherPhone),
        imageUri: submission.imageUri,
        timestamp: Date.now(),
        isBookmarked: false,
      };
      const currentNews = get().news;
      const updatedNews = [publishedNews, ...currentNews];
      await StorageService.saveNews(updatedNews);
      set({ news: updatedNews, isLoading: false });
      return true;
    } catch (error) {
      set({
        error: "Failed to submit news. Please try again.",
        isLoading: false,
      });
      return false;
    }
  },

  toggleBookmark: async (newsId: string) => {
    const { bookmarks, news } = get();
    const isBookmarked = bookmarks.includes(newsId);

    const updatedBookmarks = isBookmarked
      ? bookmarks.filter((id) => id !== newsId)
      : [...bookmarks, newsId];

    const updatedNews = news.map((item) =>
      item.id === newsId ? { ...item, isBookmarked: !isBookmarked } : item
    );

    set({ bookmarks: updatedBookmarks, news: updatedNews });
    await StorageService.saveBookmarks(updatedBookmarks);
  },

  clearError: () => set({ error: null }),
}));
