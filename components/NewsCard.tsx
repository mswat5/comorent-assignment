import { PublishedNews } from "@/lib/types/news";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface NewsCardProps {
  news: PublishedNews;
  onBookmark: (id: string) => void;
}

export function NewsCard({ news, onBookmark }: NewsCardProps) {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <View style={styles.card}>
      {news.imageUri && (
        <Image source={{ uri: news.imageUri }} style={styles.image} />
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{news.editedTitle}</Text>
          <TouchableOpacity onPress={() => onBookmark(news.id)}>
            <Ionicons
              name={news.isBookmarked ? "bookmark" : "bookmark-outline"}
              size={24}
              color={news.isBookmarked ? "#007AFF" : "#666"}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.summary}>{news.editedSummary}</Text>

        <View style={styles.tags}>
          <View style={styles.tag}>
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text style={styles.tagText}>{news.city}</Text>
          </View>
          <View style={styles.tag}>
            <Ionicons name="pricetag-outline" size={14} color="#666" />
            <Text style={styles.tagText}>{news.topic}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.publisher}>By {news.publisherName}</Text>
          <Text style={styles.phone}>{news.maskedPhone}</Text>
          <Text style={styles.time}>{formatTime(news.timestamp)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    flex: 1,
    marginRight: 8,
  },
  summary: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
    marginBottom: 12,
  },
  tags: {
    flexDirection: "row",
    marginBottom: 12,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  publisher: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  phone: {
    fontSize: 12,
    color: "#999",
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
});
