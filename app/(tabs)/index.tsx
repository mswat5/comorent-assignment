import { FilterButton } from "@/components/FilterButton";
import { NewsCard } from "@/components/NewsCard";
import { useNewsStore } from "@/lib/store/useNewsStore";
import { NEWS_TOPICS } from "@/lib/types/news";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function NewsFeedScreen() {
  const { news, loadNews, toggleBookmark, isLoading } = useNewsStore();
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [selectedTopic, setSelectedTopic] = useState<string>("All");

  const cities = ["All", ...Array.from(new Set(news.map((item) => item.city)))];

  const filteredNews = news.filter((item) => {
    const matchesCity = selectedCity === "All" || item.city === selectedCity;
    const matchesTopic =
      selectedTopic === "All" || item.topic === selectedTopic;
    return matchesCity && matchesTopic;
  });

  useEffect(() => {
    loadNews();
  }, []);

  const handleRefresh = () => {
    loadNews();
  };

  return (
    <SafeAreaView style={[styles.container, {}]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Local News Feed</Text>
        <Text style={styles.headerSubtitle}>
          {filteredNews.length}{" "}
          {filteredNews.length === 1 ? "story" : "stories"}
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
          contentContainerStyle={styles.filterContentContainer}
        >
          {cities.map((city) => (
            <View key={city} style={styles.filterButtonWrapper}>
              <FilterButton
                title={city}
                isActive={selectedCity === city}
                onPress={() => setSelectedCity(city)}
              />
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
          contentContainerStyle={styles.filterContentContainer}
        >
          <View style={styles.filterButtonWrapper}>
            <FilterButton
              title="All"
              isActive={selectedTopic === "All"}
              onPress={() => setSelectedTopic("All")}
            />
          </View>
          {NEWS_TOPICS.map((topic) => (
            <View key={topic} style={styles.filterButtonWrapper}>
              <FilterButton
                title={topic}
                isActive={selectedTopic === topic}
                onPress={() => setSelectedTopic(topic)}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.newsContainer}>
        <FlatList
          data={filteredNews}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NewsCard news={item} onBookmark={toggleBookmark} />
          )}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No news stories found</Text>
              <Text style={styles.emptySubtext}>
                Submit your first local news story!
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
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
  filterContainer: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  filterScrollView: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterContentContainer: {
    paddingRight: 16,
  },
  filterButtonWrapper: {
    marginRight: 8,
    minWidth: 60,
    height: 36,
  },
  newsContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    minHeight: 300,
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
