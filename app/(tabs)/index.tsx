import { useNewsStore } from "@/lib/store/useNewsStore";
import { NEWS_TOPICS, NewsItem } from "@/lib/types/news";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewsFeedScreen() {
  const {
    newsItems,
    filterByCity,
    filterByTopic,
    setFilterByCity,
    setFilterByTopic,
    getFilteredNews,
  } = useNewsStore();

  const filteredNews = getFilteredNews();
  const [showFilters, setShowFilters] = React.useState(false);

  const maskPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}****${cleaned.slice(-2)}`;
    }
    return phone;
  };

  const getCities = (): string[] => {
    const cities = Array.from(new Set(newsItems.map((item) => item.city)));
    return cities.sort();
  };

  const clearFilters = () => {
    setFilterByCity("");
    setFilterByTopic("");
    setShowFilters(false);
  };

  const renderNewsCard = ({ item }: { item: NewsItem }) => (
    <View style={styles.newsCard}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.newsImage} />
      )}

      <View style={styles.newsContent}>
        <View style={styles.newsHeader}>
          <Text style={styles.newsTitle}>{item.editedTitle}</Text>
          <TouchableOpacity style={styles.bookmarkButton}>
            <FontAwesome6
              name="bookmark"
              size={20}
              color={item.isBookmarked ? "#F59E0B" : "#6B7280"}
              fill={item.isBookmarked ? "#F59E0B" : "transparent"}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.newsSummary}>{item.editedSummary}</Text>

        <View style={styles.newsMetadata}>
          <View style={styles.metadataRow}>
            <View style={styles.tag}>
              <FontAwesome6 size={14} color="#6B7280" />
              <Text style={styles.tagText}>{item.city}</Text>
            </View>
            <View style={styles.tag}>
              <FontAwesome6 size={14} color="#6B7280" />
              <Text style={styles.tagText}>{item.topic}</Text>
            </View>
          </View>

          <View style={styles.publisherInfo}>
            <Text style={styles.publisherText}>
              By {item.publisherName} • {maskPhoneNumber(item.publisherPhone)}
            </Text>
            <Text style={styles.dateText}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Local News Feed</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <FontAwesome6 name="filter" size={20} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Filter by City:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {getCities().map((city) => (
                <TouchableOpacity
                  key={city}
                  style={[
                    styles.filterChip,
                    filterByCity === city && styles.filterChipSelected,
                  ]}
                  onPress={() =>
                    setFilterByCity(filterByCity === city ? "" : city)
                  }
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      filterByCity === city && styles.filterChipTextSelected,
                    ]}
                  >
                    {city}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Filter by Topic:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {NEWS_TOPICS.map((topic) => (
                <TouchableOpacity
                  key={topic}
                  style={[
                    styles.filterChip,
                    filterByTopic === topic && styles.filterChipSelected,
                  ]}
                  onPress={() =>
                    setFilterByTopic(filterByTopic === topic ? "" : topic)
                  }
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      filterByTopic === topic && styles.filterChipTextSelected,
                    ]}
                  >
                    {topic}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {(filterByCity || filterByTopic) && (
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={clearFilters}
            >
              <FontAwesome6 name="x" size={16} color="#EF4444" />
              <Text style={styles.clearFiltersText}>Clear Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {filteredNews.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No news found</Text>
          <Text style={styles.emptyStateText}>
            {newsItems.length === 0
              ? "Be the first to submit local news!"
              : "Try adjusting your filters or submit new news."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredNews}
          renderItem={renderNewsCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.newsList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  filtersContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  filterSection: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  filterChip: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterChipSelected: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  filterChipText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
  filterChipTextSelected: {
    color: "#FFFFFF",
  },
  clearFiltersButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#FEF2F2",
    borderRadius: 16,
    gap: 4,
    marginTop: 8,
  },
  clearFiltersText: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "500",
  },
  newsList: {
    padding: 16,
  },
  newsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  newsImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  newsContent: {
    padding: 16,
  },
  newsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  newsTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    lineHeight: 24,
    marginRight: 12,
  },
  bookmarkButton: {
    padding: 4,
  },
  newsSummary: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
    marginBottom: 16,
  },
  newsMetadata: {
    gap: 8,
  },
  metadataRow: {
    flexDirection: "row",
    gap: 12,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  tagText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  publisherInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  publisherText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  dateText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
});
