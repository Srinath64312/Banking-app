# NovaBanque — Modern Banking Website

A full-featured banking website built with **React**, **Tailwind CSS**, `useState`, and `useEffect`.

## 📦 Tech Stack
- React 18
- Tailwind CSS 3
- Lucide React (icons)
- CSS animations & glassmorphism

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── App.jsx                  # Root component, page routing
├── index.js                 # React entry point
├── index.css                # Tailwind + custom utilities
└── components/
    ├── Navbar.jsx           # Responsive navigation (useEffect: scroll listener)
    ├── Home.jsx             # Landing page (useEffect: count-up animation)
    ├── Dashboard.jsx        # Account overview (useEffect: greeting)
    ├── Transactions.jsx     # Transaction history (useEffect: filtering)
    ├── Cards.jsx            # Card management (useState: freeze/reveal)
    ├── Loans.jsx            # Loan management + calculator (useEffect: EMI)
    ├── Investments.jsx      # Investment portfolio & ticker simulation (useState, useEffect)
    └── Support.jsx          # FAQ + Contact form (useState: form/accordion)
```

## ✨ Features

- **Home** — Hero, stats counter, features, testimonials
- **Dashboard** — Balance card, quick actions, transactions, spending chart, savings goal
- **Transactions** — Search, filter by category, sort, export button
- **Cards** — Card flip reveal, freeze/unfreeze, spending limits
- **Loans** — Active loan tracker, real-time EMI calculator with sliders
- **Investments** — Real-time simulated stock & crypto ticker tape, interactive SVG graph, and buy/sell terminal
- **Support** — FAQ accordion, contact form with success state

## 🎨 Design

- Deep navy dark theme with gold accents
- Glassmorphism card effects
- Playfair Display + DM Sans typography
- Smooth CSS animations throughout
