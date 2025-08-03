# Local News App

## Overview

A React Native mobile application for sharing and discovering local news stories. Users can browse news by city and topic, bookmark favorite stories, and submit their own local news with images.

## Features

- Browse local news feed with topic and city filters
- Submit news stories with images
- Bookmark favorite stories
- Real-time news feed updates

## Tech Stack

- React Native with Expo
- TypeScript
- Zustand for state management
- Zod for form validation
- Expo Image Picker for camera integration

## Getting Started

### Prerequisites

- Node.js (v16+)
- bun
- Expo CLI

### Installation

```bash
# Clone the repository
git clone https://github.com/mswat5/comorent-assignment.git

# Install dependencies
cd comorent-assignment
bun install

# Start the development server
bun start
```

### GPT Validation Implementation

Explanation of GPT prompt design and decisions made
The AI validation system was designed to simulate GPT-like validation for news submissions using a mock service. The prompt design focuses on three key aspects:

Content Quality Checks: The system evaluates news submissions based on length, specificity, and relevance to ensure submissions are substantive and provide actual value to readers.

Community Safety Filtering: A keyword-based system identifies potentially inappropriate content, spam, or promotional material to maintain the platform's focus on genuine local news.

Content Enhancement: The AI service not only validates submissions but also enhances them by improving titles and summaries to better adhere to journalistic standards.

### How GPT validation/editing was implemented

The MockAIService class simulates an AI validation service with the following implementation details:

Keyword-Based Analysis: The service uses predefined sets of keywords to identify spam, inappropriate content, and local news relevance.
Contextual Validation: Submissions are checked for appropriate length, specificity, and local context.
Content Improvement: The service includes methods to improve titles and summaries by:
Fixing capitalization and punctuation
Replacing generic terms with more specific ones
Adding city context when missing
Structuring lengthy content into better sentences
Removing first-person perspectives to maintain journalistic tone

### Limitations and assumptions

Keyword Limitations: The current implementation relies on simple keyword matching, which may miss context-dependent issues or generate false positives.
No True NLP Capabilities: Without actual GPT integration, the service cannot understand nuanced content or perform complex language analysis.
Fixed Ruleset: The validation rules are static and cannot adapt to emerging patterns or edge cases without manual updates.
Simulated Delay: A random delay is added to simulate API latency, but this doesn't account for varying response times based on content complexity.
Limited Content Enhancement: The improvements made to titles and summaries follow simple rules rather than understanding the semantic meaning of the content.
