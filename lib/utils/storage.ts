import { PublishedNews } from "@/lib/types/news";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  NEWS: "@local_news_app/news",
  BOOKMARKS: "@local_news_app/bookmarks",
};

export class StorageService {
  static async saveNews(news: PublishedNews[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
    } catch (error) {
      console.error("Error saving news:", error);
    }
  }

  static async loadNews(): Promise<PublishedNews[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.NEWS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading news:", error);
      return [];
    }
  }

  static async saveBookmarks(bookmarks: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.BOOKMARKS,
        JSON.stringify(bookmarks)
      );
    } catch (error) {
      console.error("Error saving bookmarks:", error);
    }
  }

  static async loadBookmarks(): Promise<string[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading bookmarks:", error);
      return [];
    }
  }

  static maskPhoneNumber(phone: string): string {
    if (phone.length < 4) return phone;
    const start = phone.slice(0, 3);
    const end = phone.slice(-2);
    const masked = "*".repeat(phone.length - 5);
    return `${start}${masked}${end}`;
  }
}
