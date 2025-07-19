# Theme System Documentation

## Overview

This blog now includes a comprehensive theme system similar to MonkeyType's implementation. Users can switch between different themes using a theme selector located in the top-right corner of the page.

## Features

- **Dynamic Theme Switching**: Switch themes instantly without page refresh
- **Persistent Theme Selection**: Selected theme is saved to localStorage
- **Theme Preview**: Visual preview of theme colors in the selector
- **Responsive Design**: Theme selector adapts to different screen sizes
- **Smooth Animations**: Elegant transitions when switching themes

## Available Themes

1. **Default Dark** - The classic dark theme with blue accents
2. **Light** - Clean and bright light theme
3. **Gruvbox Dark** - Retro groove colors with warm tones
4. **Nord** - Arctic-inspired cool color palette
5. **Dracula** - Dark theme with purple accents
6. **Terminal Green** - Classic terminal green on black
7. **Cyberpunk** - Neon pink and cyan futuristic theme

## How to Use

1. **Theme Selector**: Click the theme selector button in the top-right corner
2. **Browse Themes**: View all available themes with color previews
3. **Select Theme**: Click on any theme to apply it instantly
4. **Automatic Persistence**: Your selection is saved and will be remembered on future visits

## Architecture

### Files Structure

```
public/themes/          # Theme CSS files
├── default.css
├── light.css
├── gruvbox-dark.css
├── nord.css
├── dracula.css
├── terminal-green.css
└── cyberpunk.css

src/
├── contexts/
│   └── ThemeContext.tsx    # Theme state management
├── components/
│   └── ThemeSelector.tsx   # Theme selector UI
├── utils/
│   └── themes.ts          # Theme configuration and loading
└── types.ts               # Theme-related TypeScript types
```

### How It Works

1. **Theme Loading**: CSS files are fetched dynamically from the public folder
2. **CSS Variables**: Each theme overrides CSS custom properties (variables)
3. **State Management**: React Context manages the current theme state
4. **Persistence**: localStorage stores the user's theme preference
5. **Dynamic Injection**: Themes are injected as `<style>` elements in the document head

## Adding New Themes

To add a new theme:

1. **Create CSS File**: Add a new CSS file in `public/themes/`

   ```css
   /* Your Theme Name */
   :root {
     --bg-primary: #your-color;
     --bg-secondary: #your-color;
     --bg-tertiary: #your-color;
     --text-primary: #your-color;
     --text-secondary: #your-color;
     --text-muted: #your-color;
     --accent: #your-color;
     --accent-hover: #your-color;
     --accent-light: rgba(your-color, 0.1);
     --border-subtle: #your-color;
     --border-light: #your-color;
     --gradient: linear-gradient(135deg, #color1 0%, #color2 100%);
   }
   ```

2. **Add to Configuration**: Update `src/utils/themes.ts`
   ```typescript
   {
     id: 'your-theme-id',
     name: 'Your Theme Name',
     description: 'Description of your theme',
     cssFile: '/themes/your-theme.css',
     preview: {
       primary: '#your-primary-color',
       secondary: '#your-secondary-color',
       accent: '#your-accent-color'
     }
   }
   ```

## CSS Variables Reference

The theme system uses the following CSS custom properties:

- `--bg-primary`: Main background color
- `--bg-secondary`: Secondary background (cards, containers)
- `--bg-tertiary`: Tertiary background (hover states)
- `--text-primary`: Primary text color
- `--text-secondary`: Secondary text color
- `--text-muted`: Muted/subtle text color
- `--accent`: Primary accent color (links, buttons)
- `--accent-hover`: Accent color hover state
- `--accent-light`: Light accent color with transparency
- `--border-subtle`: Subtle border color
- `--border-light`: Lighter border color
- `--gradient`: CSS gradient for special elements

## Customization

### Theme Selector Position

The theme selector is positioned in the top-right corner by default. To change its position, modify the CSS in `src/index.css`:

```css
.theme-selector {
  position: fixed;
  top: 2rem; /* Change this */
  right: 2rem; /* Change this */
  z-index: 1000;
}
```

### Theme Selector Appearance

Customize the appearance by modifying the CSS classes in `src/index.css`:

- `.theme-selector-button` - Main button styling
- `.theme-dropdown` - Dropdown container
- `.theme-option` - Individual theme options

## Browser Support

The theme system uses modern web APIs:

- CSS Custom Properties (CSS Variables)
- Fetch API
- ES6 Modules
- localStorage

Supported browsers:

- Chrome/Edge 49+
- Firefox 42+
- Safari 9.1+

## Performance

- **Lazy Loading**: Themes are only loaded when selected
- **Caching**: Browser automatically caches theme files
- **Minimal Bundle**: Theme files are not included in the main JavaScript bundle
- **Fast Switching**: Theme changes are applied instantly without page refresh

## Troubleshooting

### Theme Not Loading

1. Check browser console for errors
2. Verify CSS file exists in `public/themes/`
3. Ensure CSS file has valid syntax

### Theme Not Persisting

1. Check if localStorage is enabled in browser
2. Verify browser supports localStorage API

### Styling Issues

1. Check CSS variable names match the reference
2. Ensure all required variables are defined
3. Verify CSS selector specificity
