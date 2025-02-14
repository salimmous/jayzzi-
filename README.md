# Jayzzi - AI-Powered Pinterest Content Generator

## Overview

Jayzzi is an AI-powered content generation tool designed to streamline Pinterest marketing. It helps users research keywords, generate images and articles, create Pinterest pins, and track performance. This application is built with React, Vite, Zustand, Supabase, and Tailwind CSS.

**Important Note:** This project is currently under development and runs within a limited WebContainer environment. Many features are placeholders or have limited functionality due to these constraints.

## Installation and Setup (WebContainer)

Since this application runs within a WebContainer, the typical setup process for a React application is slightly different. You don't need to install Node.js or npm locally. The WebContainer provides the necessary runtime environment.

1.  **Open the Project:** Access the project through the provided WebContainer link. This will automatically load the project into the in-browser development environment.

2.  **Install Dependencies:** The dependencies should be installed automatically. If not run the command in the terminal:
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    -   The `.env` file contains important configuration variables.
    -   **`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`:** These are your Supabase project credentials. Replace `"your-project-id.supabase.co"` and `"your-supabase-anon-key"` with your actual Supabase URL and Anon Key.
    -   **`VITE_DEFAULT_ADMIN_EMAIL` and `VITE_DEFAULT_ADMIN_PASSWORD`:** These are the default credentials for the admin user.  Change `"secure-password"` to a strong password.
    -   **`VITE_PINTEREST_ACCESS_TOKEN`:**  This is your Pinterest access token. Replace `"your-pinterest-token"` with your actual token.
    - **Google Ads API Key:** Add your Google Ads API key to the `Settings` page within the application. This key will be encrypted and stored securely.

4.  **Run the Application:**
    ```bash
    npm run dev
    ```
    This will start the development server, and you can access the application in your browser.

## Supabase Setup

1.  **Create a Supabase Project:** If you haven't already, create a Supabase project at [https://supabase.com/](https://supabase.com/).
2.  **Get Project Credentials:** Obtain your Supabase URL and Anon Key from your project's API settings.
3.  **Database Schema:** The application uses a Supabase database. You'll need to set up the following tables:
    -   `users` (handled by Supabase Auth)
    -   `organizations`
    -   `keywords`
    -   `articles`
    -   `images`
    -   `pins`
    -   `settings`
    -   `calendar_events`

    The exact schema for these tables is defined within the application's code (primarily in `src/lib/db.ts` and the store files). You can create these tables manually through the Supabase dashboard or by running SQL scripts generated from the application's types.

## Feature Overview

-   **Keyword Research:** Research relevant keywords for your Pinterest content. *Currently, the Google Ads API integration is a placeholder and requires the correct API endpoint, request format, and authentication details to function correctly.*
-   **Image Generator:** Generate images for your pins. (Placeholder)
-   **Article Generator:** Generate articles for your blog posts. (Placeholder)
-   **Pin Generator:** Create Pinterest pins. (Placeholder)
-   **Article Library:** Manage your generated articles.
-   **Image Library:** Manage your generated images.
-   **Keyword Tracker:** Track the performance of your keywords. (Placeholder)
-   **Top Pins:** View your top-performing pins. (Placeholder)
-   **Pin Data:** Analyze pin performance data. (Placeholder)
-   **Settings:** Configure application settings, including API keys.
-   **Login/Recover Password:** User authentication.
-   **Calendar:** Schedule and manage your content.

## Google Ads API Integration (Important)

The Google Ads API integration is currently **not fully functional**. The current implementation in `src/lib/keywords.ts` is based on *assumptions* about the API endpoint, request format, and authentication.

**To make the Google Ads API integration work, you MUST provide the following information:**

1.  **Google Ads API Endpoint URL:** The correct URL for the API requests.
2.  **Request Format:** The exact structure of the request (headers, body) expected by the API.
3.  **Authentication Details:** How to use your API key (header format, etc.).
4.  **Customer ID:** How and where to include your Customer ID in the request.

**cPanel and Localhost:**

It's important to understand that the Google Ads API is a *remote* service. You **cannot** connect to it through `localhost` or by installing files in cPanel. cPanel is for managing *your own* web server, while the Google Ads API is accessed via HTTP requests over the internet. The code in `src/lib/keywords.ts` attempts to do this correctly using `fetch`, but it needs the correct API details to function.

## Limitations (WebContainer)

Due to the limitations of the WebContainer environment, several features are currently placeholders or have reduced functionality:

-   **AI Model Integration:** Full integration with AI models (e.g., OpenAI) is not possible.
-   **Pinterest API:** Full Pinterest API integration is limited.
-   **WordPress API:** Full WordPress API integration is limited.
-   **Analytics Data:** Fetching real analytics data is restricted.
-   **Background Tasks:** Running background tasks or scheduled jobs is not supported.

## Troubleshooting

-   **Import Errors:** If you encounter import errors, try restarting the development server. The root cause of some previous import issues is unknown, but workarounds have been implemented.
-   **Application Not Working:** Ensure your Supabase credentials and other environment variables are correctly set. Check the browser's developer console for any error messages.

## Contributing

Contributions are welcome! If you'd like to contribute to the project, please fork the repository and submit a pull request.
