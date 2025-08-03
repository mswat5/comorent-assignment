import { NewsItem } from "@/lib/types/news";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface NewsStore {
  newsItems: NewsItem[];
  addNewsItem: (item: NewsItem) => void;

  filterByCity: string;
  filterByTopic: string;
  setFilterByCity: (city: string) => void;
  setFilterByTopic: (topic: string) => void;
  getFilteredNews: () => NewsItem[];
}

export const useNewsStore = create(
  persist<NewsStore>(
    (set, get) => ({
      newsItems: [],
      bookmarkedIds: new Set(),
      filterByCity: "",
      filterByTopic: "",

      addNewsItem: (item) =>
        set((state) => ({
          newsItems: [item, ...state.newsItems],
        })),

      setFilterByCity: (city) => set({ filterByCity: city }),
      setFilterByTopic: (topic) => set({ filterByTopic: topic }),

      getFilteredNews: () => {
        const { newsItems, filterByCity, filterByTopic } = get();
        return newsItems
          .filter(
            (item) =>
              !filterByCity ||
              item.city.toLowerCase().includes(filterByCity.toLowerCase())
          )
          .filter((item) => !filterByTopic || item.topic === filterByTopic);
      },
    }),
    {
      name: "news-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
