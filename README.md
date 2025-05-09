# 🧭 Travel Planner - Frontend

A web interface for planning trips with multiple destinations, allowing users to manage activities, hotels, flights, and restaurants.

## ✨ Technologies

- [Next.js 14](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [React Query](https://tanstack.com/query/latest)
- [Lucide Icons](https://lucide.dev/)
- [Google Fonts (Geist)](https://vercel.com/font)
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview)

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/travel-planner-frontend.git
cd travel-planner-frontend

# Install dependencies
yarn install
```

## ▶️ Running the App

```bash
yarn dev
```

Open [http://localhost:4000](http://localhost:4000) in your browser.

> The root path (`/`) redirects to `/login`.

## 📁 Folder Structure

```
src/
├── api/               # API services and queries
├── app/               # Pages (Next.js App Router)
├── components/        # Reusable components
├── hooks/             # Custom React hooks
├── providers/         # Global providers (e.g., React Query)
├── styles/            # Global styles
├── utils/             # Utility functions
```

## 🔐 Authentication

Authentication is JWT-based. The access token is stored using `next-auth` and sent in requests via `Authorization: Bearer` header.

## 🔧 Environment Variables

Create a `.env.local` file:

```env
NEXTAUTH_URL=http://localhost:4000
NEXTAUTH_SECRET=your-secret
NEXT_PUBLIC_GOOGLE_API_KEY=your-google-key
AMADEUS_API_KEY=your-amadeus-key
AMADEUS_API_SECRET=your-amadeus-secret
```

## ✅ Features

- [x] User login
- [x] User Signin
- [x] Create trips with multiple destinations
- [x] Add activities per destination
- [x] Search and add hotels, flights, and restaurants using Google Places API and Amadeus
- [x] Paginated and scrollable views
- [x] Resource deletion with feedback
---

Made by [Rodrigo Mufatto]
