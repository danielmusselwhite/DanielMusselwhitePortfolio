# Daniel Musselwhite — Portfolio

A modern, interactive developer portfolio built to showcase my projects, technical skills, professional experience, education, and background.

Built with **React**, **TypeScript**, and **Vite**, with an interactive visual design, light and dark themes, responsive layouts, and an AI-powered portfolio assistant.

For more technical information please see the [Technical Documentation](./docs/TECHNICAL.md).

## ✨ Features

* Responsive single-page portfolio
* Light and dark theme support
* Persistent theme preference using local storage
* Interactive animated particle background
* Pointer-reactive visual effects
* Scroll-based section animations
* Reduced-motion accessibility support
* Projects showcase
* Technical skills section
* Professional experience timeline
* Education section
* Contact information
* AI-powered portfolio assistant
* Netlify serverless backend
* Responsive design for desktop and mobile

## 🌐 Project Architecture

![Portfolio Architecture Diagram](./docs/images/PortfolioArchitecture.png)

## 🛠️ Tech Stack

### Frontend

* **React 19**
* **TypeScript**
* **Vite**
* **CSS**
* **React Markdown**
* **Remark GFM**

### Backend & Hosting

* **Netlify**
* **Netlify Functions**
* **OpenAI Responses API**

### Development

* **Oxlint**
* **TypeScript Compiler**
* **npm**

## 🤖 AI Portfolio Assistant

The portfolio includes an AI assistant that visitors can use to ask questions about my background, experience, projects, skills, and education.

The assistant is implemented as a **Netlify Function** and communicates with the **OpenAI Responses API**.

The backend:

* Keeps the OpenAI API key server-side
* Provides portfolio-specific context to the model
* Accepts conversational questions from visitors
* Restricts the assistant to portfolio-related topics
* Includes request validation and error handling
* Implements rate limiting
* Supports configurable OpenAI models

The API endpoint is:

```text
/api/portfolio-chat
```

## 📁 Project Structure

```text
DanielMusselwhitePortfolio/
├── netlify/
│   └── functions/
│       └── portfolio-chat.mts
│
├── public/
│
├── src/
│   ├── Components/
│   │   ├── About/
│   │   ├── Contact/
│   │   ├── Education/
│   │   ├── Experience/
│   │   ├── Hero/
│   │   ├── Navbar/
│   │   ├── Projects/
│   │   └── Skills/
│   │
│   ├── Types/
│   ├── Utils/
│   ├── assets/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── index.html
├── netlify.toml
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* [Node.js](https://nodejs.org/)
* npm

### Clone the Repository

```bash
git clone https://github.com/danielmusselwhite/DanielMusselwhitePortfolio.git

cd DanielMusselwhitePortfolio
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

To use the AI portfolio assistant locally, create a `.env` file in the root of the project:

```env
OPENAI_API_KEY=your_openai_api_key
```

An alternative OpenAI model can optionally be configured:

```env
OPENAI_MODEL=your_model_name
```

> **Important:** Never commit your `.env` file or OpenAI API key to the repository.

### Start the Development Server

Because the AI assistant is implemented using a Netlify Function, local development should be started using **Netlify Dev** rather than running the Vite development server directly.

```bash
npx netlify dev
```

Netlify Dev will start the frontend development server and make the Netlify Function available locally, allowing the AI portfolio assistant to work during development.

## 🔐 Environment Variables

The AI portfolio assistant requires an OpenAI API key.

For local development, create a `.env` file in the project root containing:

```env
OPENAI_API_KEY=your_openai_api_key
```

An alternative OpenAI model can optionally be configured with:

```env
OPENAI_MODEL=your_model_name
```

When deploying to Netlify, configure these values through Netlify's environment variable settings rather than committing them to the repository.

> **Important:** Never commit your API key or `.env` file to the repository.

## 📜 Available Scripts

### Start local development

To run the full application locally, including the Netlify Function used by the AI assistant:

```bash
npx netlify dev
```

### Create a production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

### Run the linter

```bash
npm run lint
```

## 🌗 Theme System

The portfolio includes both dark and light themes.

The selected theme is stored in the browser using `localStorage`, allowing the visitor's preference to persist between sessions.

## 🎨 Interactive Background

The site includes a custom canvas-based particle system featuring:

* Dynamically generated particles
* Connections between nearby particles
* Cursor interaction
* Pointer-following glow effects
* Theme-aware colours
* Responsive particle counts based on viewport size

The animation also respects the user's `prefers-reduced-motion` accessibility setting for section transitions.

## ☁️ Deployment

The project is configured for deployment with **Netlify**.

The frontend is built with Vite, while the AI assistant runs through a Netlify serverless function.

Before deploying, ensure that the following environment variable has been configured in Netlify:

```text
OPENAI_API_KEY
```

Optionally:

```text
OPENAI_MODEL
```

## 👨‍💻 Author

**Daniel Musselwhite**

GitHub: [@danielmusselwhite](https://github.com/danielmusselwhite)

## 📄 License

This repository currently does not include a licence.

Unless a licence is added, the source code should be considered **all rights reserved** by default.

---

Built by **Daniel Musselwhite**.
