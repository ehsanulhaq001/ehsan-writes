# Minimal Blog

A modern, minimal blog built with React, TypeScript, and Vite. Features a sleek design and markdown-based content management.

## Features

- 📝 **Markdown-based content** - Write posts in markdown with frontmatter metadata
- 🎨 **Modern design** - Clean, sleek interface with smooth animations
- 🔍 **Search & filtering** - Full-text search and tag-based filtering
- 📱 **Responsive** - Works perfectly on all device sizes
- ⚡ **Fast** - Built with Vite for lightning-fast development and builds
- 🌙 **Dark theme** - Beautiful dark color scheme

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

## Adding Blog Posts

Create new blog posts by adding markdown files to the `/content` directory.

### Post Format

Each post should be a `.md` file with frontmatter metadata:

```markdown
---
title: Your Post Title
excerpt: A brief description of your post
date: 2024-01-20
tags: tag1, tag2, tag3
author: Your Name
---

# Your Post Title

Your markdown content goes here...
```

### Frontmatter Fields

- `title` (required) - The post title
- `excerpt` (required) - A brief description shown in the post list
- `date` (required) - Publication date in YYYY-MM-DD format
- `tags` (required) - Comma-separated list of tags
- `author` (optional) - Author name

### File Naming

Use descriptive filenames for your markdown files, as they become the URL slug:

- `my-first-post.md` → `/post/my-first-post`
- `hello-world.md` → `/post/hello-world`

## Project Structure

```
├── content/                 # Blog posts (markdown files)
├── src/
│   ├── components/         # React components
│   ├── utils/             # Utility functions
│   ├── types.ts           # TypeScript types
│   └── index.css          # Global styles
├── public/                # Static assets
└── dist/                  # Build output
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking

### Customization

#### Colors and Theming

Modify CSS custom properties in `src/index.css`:

```css
:root {
  --bg-primary: #0a0a0a;
  --bg-secondary: #111111;
  --accent: #3b82f6;
  /* ... other variables */
}
```

#### Typography

The blog uses system fonts by default. To change fonts, update the font-family in `:root`:

```css
:root {
  font-family: "Your Font", system-ui, sans-serif;
}
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## Deployment

This blog can be deployed to any static hosting service:

- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `dist/` folder or connect via Git
- **GitHub Pages**: Use GitHub Actions to build and deploy
- **Cloudflare Pages**: Connect your repository for automatic builds

## License

MIT License - feel free to use this project for your own blog!
