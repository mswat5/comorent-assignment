import { NewsCard } from "@/components/NewsCard";
import { useNewsStore } from "@/lib/store/useNewsStore";
import React, { useEffect } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function BookmarksScreen() {
  const { news, loadNews, toggleBookmark, isLoading } = useNewsStore();

  // Filter only bookmarked news
  const bookmarkedNews = news.filter((item) => item.isBookmarked);

  useEffect(() => {
    loadNews();
  }, []);

  const handleRefresh = () => {
    loadNews();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookmarks</Text>
        <Text style={styles.headerSubtitle}>
          {bookmarkedNews.length} saved{" "}
          {bookmarkedNews.length === 1 ? "story" : "stories"}
        </Text>
      </View>

      <FlatList
        data={bookmarkedNews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NewsCard news={item} onBookmark={toggleBookmark} />
        )}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No bookmarked stories</Text>
            <Text style={styles.emptySubtext}>
              Bookmark stories from the news feed to save them here
            </Text>
          </View>
        }
        contentContainerStyle={
          bookmarkedNews.length === 0 ? styles.emptyContainer : undefined
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
