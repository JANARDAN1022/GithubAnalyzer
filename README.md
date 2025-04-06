# GitHub User Profile Analyzer

A responsive and interactive GitHub profile analyzer built using **React**, **TypeScript**, and **ShadCN UI components**.

This application allows users to input a GitHub username and view a detailed breakdown of their public activity, repositories, commit history, and more.

---

## Features

- **GitHub User Search**

  - Input a GitHub username to fetch public profile data
  - Tracks recent searches and identifies search source (e.g., Enter key or button)

- **View Modes**

  - Tab View for organized layout
  - Chart View for visual insights

- **Repository Listing**

  - Displays all public repositories
  - Includes stars, forks, views, and last updated timestamps
  - Search filter to quickly find specific repositories

- **Commit Activity Chart**

  - Visualizes commit activity for the last 30 days, 3 months, or 1 year

- **Languages Used Chart**

  - Pie chart showing breakdown of programming languages used in repositories

- **User Profile Info**

  - Avatar, name, bio, followers/following count, and public metadata

- **Dark and Light Mode**

  - Toggle between light, dark, or system theme using `next-themes`

- **Responsive Design**
  - Fully optimized for desktop, tablet, and mobile devices

---

## Technologies Used

- React
- TypeScript
- Vite
- ShadCN UI (Tailwind-based)
- Chart.js (`react-chartjs-2`)
- GitHub REST API v3
- `next-themes` for theme switching

---

## Setups and Installation

using a ZIP file, extract the folder and navigate into it in your terminal.
npm install
npm run dev
Visit: http://localhost:5173

to test it out

for Production:-
npm run build
npm run preview

How to Deploy
You can deploy this application on any static hosting provider such as Vercel, Netlify, or GitHub Pages.

Option 1: Vercel
Go to https://vercel.com

Click "Add New Project"

Import the project from your GitHub repository or upload manually

Use the following settings:

Framework Preset: Vite

Build Command: npm run build

Output Directory: dist

Click "Deploy"
