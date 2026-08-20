# Technical Overview

This document gives a high-level overview of how the portfolio is structured and how the main parts of the application connect together.

It is intended as a quick technical reference rather than detailed implementation documentation.

## Architecture

The portfolio is a **React + TypeScript single-page application** built with **Vite** and deployed through **Netlify**.

Most of the site runs entirely in the browser.

The only server-side functionality is the AI portfolio assistant, which uses a **Netlify Function** to communicate securely with the OpenAI API.

```text
Browser
│
├── React Portfolio
│   ├── Navbar
│   ├── Hero
│   ├── About
│   ├── Skills
│   ├── Projects
│   ├── Experience
│   ├── Education
│   └── Contact
│
└── AI Assistant
        │
        ▼
   Netlify Function
        │
        ▼
   OpenAI API
```

## Frontend Structure

`main.tsx` is the entry point for the React application.

It mounts the main:

```text
App.tsx
```

component.

`App.tsx` acts as the top-level layout and brings together the major portfolio sections.

```text
App
├── Navbar
├── Hero
├── About
├── Skills
├── Projects
├── Experience
├── Education
└── Contact
```

The portfolio is a single page rather than multiple routed pages.

Navigation links point directly to section IDs such as:

```text
#about
#projects
#experience
#contact
```

This keeps navigation simple and avoids introducing a router where one is not necessary.

## Component Responsibilities

The application is split into components based on responsibility.

For example:

```text
Navbar
```

handles navigation and the theme toggle.

```text
Hero
```

contains the introduction and AI assistant.

```text
Projects
```

loads and displays portfolio projects.

```text
ProjectCard
```

handles the presentation and interaction of an individual project.

```text
AiAssistant
```

coordinates the AI chat interface and mascot.

This keeps individual components focused and makes the project easier to navigate.

## State Management

The application uses standard React state rather than a global state-management library.

State is generally kept in the component that owns the behaviour.

For example:

```text
App
└── theme

Navbar
└── mobile menu state

ProjectCard
├── current image
└── window state

AiChat
├── messages
├── input
└── loading state
```

Shared state is moved to the nearest common parent when multiple components need access to it.

Because the portfolio is relatively small, this approach avoids unnecessary complexity.

## Theme System

The application supports:

```text
Dark Mode
Light Mode
```

The current theme is owned by `App.tsx`.

The Navbar receives the current theme and a callback for changing it.

The selected theme is also stored in:

```text
localStorage
```

so the visitor's preference is remembered between visits.

The theme also affects the animated background, allowing the canvas colours to match the rest of the site.

## Projects System

Projects are not manually written directly into the React component.

Instead, each project has its own folder containing project information and images.

Example:

```text
Projects/
└── ExampleProject/
    ├── project.json
    └── Images/
        ├── screenshot-1.png
        └── screenshot-2.png
```

The project JSON contains information such as:

```text
Title
Description
Technologies
Overview
Problem
Solution
GitHub link
Demo link
```

Vite's:

```text
import.meta.glob
```

feature automatically discovers the project files.

The flow is roughly:

```text
Project files
     │
     ▼
loadProjects()
     │
     ▼
Project data
     │
     ▼
Projects component
     │
     ▼
ProjectCard
```

This means a new project can largely be added by creating a new project folder rather than modifying the React application itself.

## Project Types

TypeScript interfaces define the expected shape of project data.

These live under:

```text
src/Types/
```

This gives the project loader and React components a shared understanding of what a project should contain.

It also makes mistakes in project metadata easier to catch during development.

## Visual Effects

The site includes an animated canvas background controlled by `App.tsx`.

The canvas creates:

```text
Particles
Connections
Pointer interaction
Glow effects
```

The animation is separate from the main React content.

This allows React to handle the application interface while the Canvas API handles continuous visual rendering more efficiently.

The site also uses `IntersectionObserver` to reveal sections as they enter the viewport.

Reduced-motion accessibility preferences are respected so these animations can be disabled where appropriate.

## AI Assistant

The AI assistant is split across the frontend and backend.

The frontend contains:

```text
AiAssistant
├── AiMascot
└── AiChat
```

`AiChat` is responsible for the conversation interface.

`AiMascot` provides visual feedback such as:

```text
Idle
Thinking
Busy
Speaking
Error
```

The parent `AiAssistant` component coordinates state between them.

## AI Request Flow

When a visitor asks the assistant a question:

```text
Visitor
   │
   ▼
AiChat
   │
   ▼
POST /api/portfolio-chat
   │
   ▼
Netlify Function
   │
   ▼
OpenAI API
   │
   ▼
Netlify Function
   │
   ▼
AiChat
```

The browser never talks directly to OpenAI.

This is important because the OpenAI API key must remain private.

## Netlify Function

The backend for the assistant lives in:

```text
netlify/functions/portfolio-chat.mts
```

Its responsibilities are broadly:

```text
Receive the user's question
Validate the request
Load portfolio information
Build AI instructions
Call OpenAI
Return the answer
```

The OpenAI key is stored as a Netlify environment variable:

```text
OPENAI_API_KEY
```

This keeps the credential outside of the frontend bundle.

## AI Portfolio Context

The assistant is designed to answer questions specifically about the portfolio rather than acting as a general-purpose chatbot.

Its knowledge comes from:

```text
portfolio-context.txt
```

and the same:

```text
project.json
```

files used by the Projects section.

This creates an important relationship:

```text
             project.json
                /    \
               /      \
              ▼        ▼
      Projects UI    AI Assistant
```

The same project metadata therefore helps power both the visible portfolio and the AI's understanding of those projects.

This avoids maintaining two completely separate sources of project information.

## Styling

The project uses standard CSS rather than a UI framework.

Styles are split between global application styles and component-specific styles.

The naming convention generally follows a structure similar to:

```text
component
component__element
component--modifier
```

For example:

```text
project-window
project-window__content
project-window--expanded
```

This makes it easier to understand which styles belong to which component.

## Build and Deployment

The frontend is built using:

```text
TypeScript
   │
   ▼
Vite
   │
   ▼
Production frontend
```

Netlify then hosts both:

```text
Static frontend files
+
Serverless AI function
```

So the deployed architecture is roughly:

```text
GitHub Repository
       │
       ▼
     Netlify
      /    \
     /      \
    ▼        ▼
Frontend   Function
             │
             ▼
          OpenAI
```

## Key Technical Relationships

The main relationships worth remembering are:

```text
main.tsx
   │
   ▼
App.tsx
   │
   ├── site sections
   ├── theme
   └── background animation
```

```text
project.json
   │
   ▼
loadProjects()
   │
   ▼
Projects
   │
   ▼
ProjectCard
```

```text
project.json
   │
   ▼
Netlify Function
   │
   ▼
AI Portfolio Context
```

```text
AiChat
   │
   ▼
Netlify Function
   │
   ▼
OpenAI
```

## Summary

The portfolio is intentionally kept relatively simple.

The frontend is a standard React application composed of independent sections and components.

Projects are driven by structured JSON rather than being hardcoded into components.

React state is kept local wherever possible rather than introducing a global state-management system.

Vite handles development, builds and automatic project discovery.

Netlify hosts the frontend and provides the small serverless backend required by the AI assistant.

OpenAI is only accessed through that backend so credentials remain private.

The most important architectural idea is that the portfolio's project metadata acts as a shared source of information for both the **Projects UI** and the **AI assistant**, keeping the application easy to maintain without requiring a database or CMS.
