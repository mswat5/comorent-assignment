import { AIValidationResult, NewsSubmission } from "@/lib/types/news";

// Mocked AI service that simulates GPT-4o-mini behavior for news validation and editing
export class MockAIService {
  private static readonly SPAM_KEYWORDS = [
    "buy now",
    "click here",
    "free money",
    "urgent",
    "winner",
    "limited time",
    "act now",
    "special offer",
    "discount",
    "sale",
    "promotion",
    "deal",
  ];

  private static readonly INAPPROPRIATE_KEYWORDS = [
    "hate",
    "violence",
    "discriminate",
    "attack",
    "threat",
    "harm",
    "illegal",
    "drugs",
    "weapon",
    "abuse",
    "harassment",
  ];

  private static readonly LOCAL_NEWS_KEYWORDS = [
    "city",
    "local",
    "community",
    "neighborhood",
    "residents",
    "area",
    "district",
    "town",
    "municipal",
    "county",
    "street",
    "park",
    "school",
    "hospital",
    "police",
    "fire",
    "council",
    "mayor",
    "event",
    "festival",
    "accident",
  ];

  static async validateAndEdit(
    submission: NewsSubmission
  ): Promise<AIValidationResult> {
    // Simulate GPT-4o-mini API processing delay (1.5-3 seconds)
    const delay = Math.random() * 1500 + 1500;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const fullText =
      `${submission.title} ${submission.description}`.toLowerCase();

    // 1. Check for spam/promotional content
    const hasSpam = this.SPAM_KEYWORDS.some((keyword) =>
      fullText.includes(keyword)
    );
    if (hasSpam) {
      return {
        isValid: false,
        reason:
          "AI Validation Failed: Content appears to be spam or promotional material. Local news should focus on community events, not advertisements or sales pitches.",
      };
    }

    // 2. Check for inappropriate/harmful content
    const hasInappropriate = this.INAPPROPRIATE_KEYWORDS.some((keyword) =>
      fullText.includes(keyword)
    );
    if (hasInappropriate) {
      return {
        isValid: false,
        reason:
          "AI Validation Failed: Content contains inappropriate or harmful material that violates community safety guidelines. Please submit constructive local news.",
      };
    }

    // 3. Check if content is actually local news related
    const hasLocalContext =
      this.LOCAL_NEWS_KEYWORDS.some((keyword) => fullText.includes(keyword)) ||
      submission.city.trim().length > 2;

    // 4. Validate content length and local relevance
    if (!hasLocalContext && submission.description.length < 80) {
      return {
        isValid: false,
        reason:
          "AI Validation Failed: Content does not appear to be local news or lacks sufficient detail. Please describe how this event impacts your local community and provide more context.",
      };
    }

    // 5. Check for minimum content quality
    if (submission.title.length < 10) {
      return {
        isValid: false,
        reason:
          "AI Validation Failed: News title is too short. Please provide a more descriptive headline that clearly explains the news event.",
      };
    }

    // 6. Check for generic/vague content
    const vagueWords = [
      "something",
      "stuff",
      "things",
      "whatever",
      "maybe",
      "probably",
    ];
    const hasVagueContent = vagueWords.some((word) => fullText.includes(word));
    if (hasVagueContent && submission.description.length < 120) {
      return {
        isValid: false,
        reason:
          "AI Validation Failed: Content appears too vague or generic. Please provide specific details about what happened, when, and how it affects the community.",
      };
    }

    // 7. Generate AI-edited content (GPT-4o-mini style improvements)
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
    // Simulate GPT-4o-mini title improvement
    let improved = title.trim();

    // Fix capitalization
    improved = improved.charAt(0).toUpperCase() + improved.slice(1);

    // Clean up punctuation
    improved = improved.replace(/[!]{2,}/g, "!").replace(/[?]{2,}/g, "?");
    improved = improved.replace(/\.{2,}/g, ".");

    // Add proper ending if missing
    if (!improved.match(/[.!?]$/)) {
      improved += "";
    }

    // Make it more news-like (add location context if missing obvious location words)
    const locationWords = ["in", "at", "near", "downtown", "local"];
    const hasLocation = locationWords.some((word) =>
      improved.toLowerCase().includes(word)
    );

    // Simulate GPT making titles more engaging
    if (improved.toLowerCase().includes("accident")) {
      improved = improved.replace(/accident/i, "Traffic Incident");
    }
    if (improved.toLowerCase().includes("festival")) {
      improved = improved.replace(/festival/i, "Community Festival");
    }

    return improved;
  }

  private static improveSummary(
    description: string,
    city: string,
    topic: string
  ): string {
    // Simulate GPT-4o-mini summary improvement and editing
    let summary = description.trim();

    // Fix basic grammar and structure
    summary = summary.charAt(0).toUpperCase() + summary.slice(1);

    // Add location context if missing (GPT would do this)
    if (!summary.toLowerCase().includes(city.toLowerCase()) && city.trim()) {
      summary = `${summary} The ${topic.toLowerCase()} occurred in ${city}, affecting local residents.`;
    }

    // Ensure proper news format (2-3 sentences max)
    const sentences = summary
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0);
    if (sentences.length > 3) {
      summary = sentences.slice(0, 3).join(". ") + ".";
    } else if (sentences.length === 1 && summary.length > 100) {
      // GPT would break long single sentences into multiple sentences
      const midPoint = summary.indexOf(" ", summary.length / 2);
      if (midPoint > 0) {
        summary =
          summary.substring(0, midPoint) +
          ". " +
          summary
            .substring(midPoint + 1)
            .charAt(0)
            .toUpperCase() +
          summary.substring(midPoint + 2);
      }
    }

    // Add professional news tone
    summary = summary.replace(/\bi\b/gi, "the reporter");
    summary = summary.replace(/\bmy\b/gi, "the");
    summary = summary.replace(/\bme\b/gi, "local residents");

    // Ensure it ends with proper punctuation
    if (!summary.match(/[.!?]$/)) {
      summary += ".";
    }

    return summary;
  }
}
