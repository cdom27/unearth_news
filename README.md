# Unearth News

A news analysis platform that helps users understand article credibility, bias, and factual accuracy through AI-powered analysis.

## Overview

Unearth News analyzes articles submitted by users to provide insights on bias, misinformation, and factual accuracy. The platform parses article content, extracts key information, and cross-references claims against verified sources and media rating databases including AllSides, Media Bias Fact Check, Ad Fontes, and NewsGuard.

Key features include:
- Article analysis with bias and credibility reports
- Media source database with ratings and factual scores
- Related article discovery via NewsAPI
- Non-partisan analysis based on multiple rating sources

## Tech Stack

**Frontend:** Vite, React, TypeScript, Tailwind, Zod, React Hook Form

**Backend:** Express, TypeScript, Readability.js, Gemini AI, Compromise (NLP), PostgreSQL

**Infrastructure:** GCP Cloud Run, Neon PostgreSQL, Docker CI/CD

## Getting Started

### Prerequisites

- Node.js and npm
- PostgreSQL database
- GCP account (for Gemini integration)
- Other API keys: NewsAPI

### Installation
```bash
git clone https://github.com/yourusername/unearth-news.git
cd unearth-news
```

Install dependencies:
```bash
cd api
npm install

cd ../client
npm install
```

### Environment Setup

Create `.env` files in both api and client directories with required API keys and database credentials:

```bash
# api
PORT=
DB_URL=
CLIENT_ORIGIN=
SYS_PROMPT_PATH=
GOOGLE_APPLICATION_CREDENTIALS=
GCP_PROJECT_ID=
GCP_REGION=
NEWS_API_KEY=

# client
VITE_API_BASE_URL=
```

> Note: If you'd like to run or deploy the apps separately, remove the client serving lines from `api/index.ts`

## Roadmap
- **Topic grouping:** Analyze discussions across multiple sources for cohesive topic insights
- **Data visualizations:** Interactive charts and graphs for trend analyses

## Contributing
Contributions are welcome. Please open an issue or submit a pull request.

## License

[MIT](LICENSE)
