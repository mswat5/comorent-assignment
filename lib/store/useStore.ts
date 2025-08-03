import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useStore = create(
  persist((set, get) => {}, {
    name: "news-store",
    storage: createJSONStorage(() => AsyncStorage),
  })
);
