import { AIValidationResult, NewsSubmission } from "@/lib/types/news";

// Mocked AI service that simulates GPT-4o-mini behavior
export class MockAIService {
  private static readonly SPAM_KEYWORDS = [
    "buy now",
    "click here",
    "free money",
    "urgent",
    "winner",
  ];
  private static readonly INAPPROPRIATE_KEYWORDS = [
    "hate",
    "violence",
    "discriminate",
  ];

  static async validateAndEdit(
    submission: NewsSubmission
  ): Promise<AIValidationResult> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const fullText =
      `${submission.title} ${submission.description}`.toLowerCase();

    // Check for spam
    const hasSpam = this.SPAM_KEYWORDS.some((keyword) =>
      fullText.includes(keyword)
    );
    if (hasSpam) {
      return {
        isValid: false,
        reason:
          "Content appears to be spam or promotional material. Please submit genuine local news.",
      };
    }

    // Check for inappropriate content
    const hasInappropriate = this.INAPPROPRIATE_KEYWORDS.some((keyword) =>
      fullText.includes(keyword)
    );
    if (hasInappropriate) {
      return {
        isValid: false,
        reason:
          "Content contains inappropriate material that violates our community guidelines.",
      };
    }

    // Check if content is local news related
    const localNewsKeywords = [
      "city",
      "local",
      "community",
      "neighborhood",
      "residents",
      "area",
      "district",
    ];
    const hasLocalContext =
      localNewsKeywords.some((keyword) => fullText.includes(keyword)) ||
      submission.city.trim().length > 0;

    if (!hasLocalContext && submission.description.length < 100) {
      return {
        isValid: false,
        reason:
          "Content does not appear to be local news. Please provide more details about the local impact or significance.",
      };
    }

    // Generate edited content
    const editedTitle = this.improveTitle(submission.title);
    const editedSummary = this.improveSummary(
      submission.description,
      submission.city,
      submission.topic
    );

    return {
      isValid: true,
      editedTitle,
      editedSummary,
    };
  }

  private static improveTitle(title: string): string {
    // Simple title improvement logic
    let improved = title.trim();

    // Ensure proper capitalization
    improved = improved.charAt(0).toUpperCase() + improved.slice(1);

    // Remove excessive punctuation
    improved = improved.replace(/[!]{2,}/g, "!").replace(/[?]{2,}/g, "?");

    // Ensure it ends properly
    if (!improved.match(/[.!?]$/)) {
      improved += ".";
    }

    return improved;
  }

  private static improveSummary(
    description: string,
    city: string,
    topic: string
  ): string {
    // Simple summary improvement logic
    let summary = description.trim();

    // Ensure proper sentence structure
    summary = summary.charAt(0).toUpperCase() + summary.slice(1);

    // Add context if missing
    if (!summary.toLowerCase().includes(city.toLowerCase()) && city.trim()) {
      summary = `${summary} This ${topic.toLowerCase()} took place in ${city}.`;
    }

    // Limit to reasonable length (2-3 sentences)
    const sentences = summary
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0);
    if (sentences.length > 3) {
      summary = sentences.slice(0, 3).join(". ") + ".";
    }

    return summary;
  }
}
