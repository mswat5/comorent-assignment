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

##### Explanation of GPT prompt design and decisions made:

The AI validation system was designed to simulate GPT-like validation for news submissions using a mock service. The prompt design focuses on three key aspects:

Content Quality Checks: The system evaluates news submissions based on length, specificity, and relevance to ensure submissions are substantive and provide actual value to readers.

Community Safety Filtering: A keyword-based system identifies potentially inappropriate content, spam, or promotional material to maintain the platform's focus on genuine local news.

Content Enhancement: The AI service not only validates submissions but also enhances them by improving titles and summaries to better adhere to journalistic standards.
