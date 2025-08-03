import ErrorMessage from "@/components/ErrorMessage";
import LoadingSpinner from "@/components/LoadingSpinner";
import { validateAndEditNews } from "@/lib/services/openaiService";
import { useNewsStore } from "@/lib/store/useNewsStore";
import { NEWS_TOPICS, NewsSubmission } from "@/lib/types/news";
import { FontAwesome6 } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SubmitNewsScreen() {
  const [formData, setFormData] = useState<NewsSubmission>({
    title: "",
    description: "",
    city: "",
    topic: "",
    publisherName: "",
    publisherPhone: "",
    image: undefined,
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { addNewsItem } = useNewsStore();

  const submitMutation = useMutation({
    mutationFn: validateAndEditNews,
    onSuccess: (result) => {
      if (result.isApproved && result.editedTitle && result.editedSummary) {
        const newsItem = {
          id: Date.now().toString(),
          originalTitle: formData.title,
          originalDescription: formData.description,
          editedTitle: result.editedTitle,
          editedSummary: result.editedSummary,
          city: formData.city,
          topic: formData.topic,
          publisherName: formData.publisherName,
          publisherPhone: formData.publisherPhone,
          image: selectedImage || undefined,
          createdAt: new Date().toISOString(),
        };

        addNewsItem(newsItem);

        Alert.alert(
          "News Published!",
          "Your news has been reviewed and published to the feed.",
          [{ text: "OK", onPress: resetForm }]
        );
      } else {
        Alert.alert(
          "Submission Rejected",
          result.rejectionReason ||
            "Your news submission was rejected by our AI editor.",
          [{ text: "OK", onPress: resetForm }]
        );
      }
    },
    onError: (error) => {
      resetForm();
      Alert.alert(
        "Submission Failed",
        "There was an error processing your submission. Please try again.",
        [{ text: "OK" }]
      );
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      city: "",
      topic: "",
      publisherName: "",
      publisherPhone: "",
      image: undefined,
    });
    setSelectedImage(null);
    setValidationErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.description.trim())
      errors.description = "Description is required";
    else if (formData.description.length < 50)
      errors.description = "Description must be at least 50 characters";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.topic) errors.topic = "Topic is required";
    if (!formData.publisherName.trim())
      errors.publisherName = "Publisher name is required";
    if (!formData.publisherPhone.trim())
      errors.publisherPhone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.publisherPhone.replace(/\D/g, ""))) {
      errors.publisherPhone = "Please enter a valid 10-digit phone number";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    submitMutation.mutate(formData);
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Permission to access gallery is required!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Permission to access camera is required!"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const removeImage = () => setSelectedImage(null);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Submit Local News</Text>
          <Text style={styles.subtitle}>
            Share what's happening in your community
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>News Title *</Text>
            <TextInput
              style={[
                styles.input,
                validationErrors.title && styles.inputError,
              ]}
              value={formData.title}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, title: text }))
              }
              placeholder="Enter a compelling headline"
              maxLength={100}
            />
            {validationErrors.title && (
              <Text style={styles.errorText}>{validationErrors.title}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description * (min. 50 characters)</Text>
            <TextInput
              style={[
                styles.textArea,
                validationErrors.description && styles.inputError,
              ]}
              value={formData.description}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, description: text }))
              }
              placeholder="Describe what happened in detail..."
              multiline
              numberOfLines={4}
              maxLength={500}
            />
            <Text style={styles.charCount}>
              {formData.description.length}/500
            </Text>
            {validationErrors.description && (
              <Text style={styles.errorText}>
                {validationErrors.description}
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>City *</Text>
            <TextInput
              style={[styles.input, validationErrors.city && styles.inputError]}
              value={formData.city}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, city: text }))
              }
              placeholder="Enter your city"
              maxLength={50}
            />
            {validationErrors.city && (
              <Text style={styles.errorText}>{validationErrors.city}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Topic/Category *</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.topicScroll}
            >
              {NEWS_TOPICS.map((topic) => (
                <TouchableOpacity
                  key={topic}
                  style={[
                    styles.topicChip,
                    formData.topic === topic && styles.topicChipSelected,
                  ]}
                  onPress={() => setFormData((prev) => ({ ...prev, topic }))}
                >
                  <Text
                    style={[
                      styles.topicChipText,
                      formData.topic === topic && styles.topicChipTextSelected,
                    ]}
                  >
                    {topic}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {validationErrors.topic && (
              <Text style={styles.errorText}>{validationErrors.topic}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Your First Name *</Text>
            <TextInput
              style={[
                styles.input,
                validationErrors.publisherName && styles.inputError,
              ]}
              value={formData.publisherName}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, publisherName: text }))
              }
              placeholder="Enter your first name"
              maxLength={50}
            />
            {validationErrors.publisherName && (
              <Text style={styles.errorText}>
                {validationErrors.publisherName}
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={[
                styles.input,
                validationErrors.publisherPhone && styles.inputError,
              ]}
              value={formData.publisherPhone}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, publisherPhone: text }))
              }
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              maxLength={15}
            />
            {validationErrors.publisherPhone && (
              <Text style={styles.errorText}>
                {validationErrors.publisherPhone}
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Image (Optional)</Text>
            {selectedImage ? (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.selectedImage}
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={removeImage}
                >
                  <FontAwesome6 name="x" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.imageButtons}>
                <TouchableOpacity
                  style={styles.imageButton}
                  onPress={takePhoto}
                >
                  <FontAwesome6 name="camera" size={24} color="#3B82F6" />
                  <Text style={styles.imageButtonText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.imageButton}
                  onPress={pickImage}
                >
                  <FontAwesome6 name="image" size={24} color="#3B82F6" />
                  <Text style={styles.imageButtonText}>
                    Choose from Gallery
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              submitMutation.isPending && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={submitMutation.isPending}
          >
            {submitMutation.isPending ? (
              <LoadingSpinner text="AI is reviewing your news..." />
            ) : (
              <Text style={styles.submitButtonText}>Submit for AI Review</Text>
            )}
          </TouchableOpacity>

          {submitMutation.isError && (
            <ErrorMessage
              message="Failed to submit news. Please check your connection and try again."
              onRetry={() => submitMutation.mutate(formData)}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    height: 100,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444",
    marginTop: 4,
  },
  charCount: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "right",
    marginTop: 4,
  },
  topicScroll: {
    marginBottom: 8,
  },
  topicChip: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  topicChipSelected: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  topicChipText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  topicChipTextSelected: {
    color: "#FFFFFF",
  },
  imageButtons: {
    flexDirection: "row",
    gap: 12,
  },
  imageButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#3B82F6",
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  imageButtonText: {
    fontSize: 16,
    color: "#3B82F6",
    fontWeight: "500",
  },
  imageContainer: {
    position: "relative",
  },
  selectedImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#EF4444",
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
