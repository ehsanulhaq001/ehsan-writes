import { Theme } from '../types';

export const themes: Theme[] = [
  {
    id: 'default',
    name: 'Default Dark',
    description: 'The classic dark theme with blue accents',
    cssFile: '/themes/default.css',
    preview: {
      primary: '#0a0a0a',
      secondary: '#111111',
      accent: '#3b82f6'
    }
  },
  {
    id: 'light',
    name: 'Light',
    description: 'Clean and bright light theme',
    cssFile: '/themes/light.css',
    preview: {
      primary: '#ffffff',
      secondary: '#f8f9fa',
      accent: '#0066cc'
    }
  },
  {
    id: 'gruvbox-dark',
    name: 'Gruvbox Dark',
    description: 'Retro groove colors with warm tones',
    cssFile: '/themes/gruvbox-dark.css',
    preview: {
      primary: '#282828',
      secondary: '#32302f',
      accent: '#d79921'
    }
  },
  {
    id: 'nord',
    name: 'Nord',
    description: 'Arctic-inspired cool color palette',
    cssFile: '/themes/nord.css',
    preview: {
      primary: '#2e3440',
      secondary: '#3b4252',
      accent: '#88c0d0'
    }
  },
  {
    id: 'dracula',
    name: 'Dracula',
    description: 'Dark theme with purple accents',
    cssFile: '/themes/dracula.css',
    preview: {
      primary: '#282a36',
      secondary: '#44475a',
      accent: '#bd93f9'
    }
  },
  {
    id: 'terminal-green',
    name: 'Terminal Green',
    description: 'Classic terminal green on black',
    cssFile: '/themes/terminal-green.css',
    preview: {
      primary: '#0c1017',
      secondary: '#1a1f29',
      accent: '#39ff14'
    }
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Neon pink and cyan futuristic theme',
    cssFile: '/themes/cyberpunk.css',
    preview: {
      primary: '#0a0a0a',
      secondary: '#1a0d1a',
      accent: '#00ffff'
    }
  }
];

export const defaultTheme = 'default';

// Theme management functions
let currentThemeElement: HTMLStyleElement | null = null;

export async function loadTheme(themeId: string): Promise<void> {
  const theme = themes.find(t => t.id === themeId);
  if (!theme) {
    throw new Error(`Theme ${themeId} not found`);
  }

  // Remove existing theme
  if (currentThemeElement) {
    currentThemeElement.remove();
    currentThemeElement = null;
  }

  try {
    // Fetch the CSS file from public folder
    const response = await fetch(theme.cssFile);

    if (!response.ok) {
      throw new Error(`Failed to fetch theme ${themeId}`);
    }

    const cssText = await response.text();

    // Create and append style element
    const style = document.createElement('style');
    style.textContent = cssText;
    style.setAttribute('data-theme', themeId);

    document.head.appendChild(style);
    currentThemeElement = style;
  } catch (error) {
    throw new Error(`Failed to load theme ${themeId}: ${error}`);
  }
}

export function getStoredTheme(): string {
  return localStorage.getItem('selectedTheme') || defaultTheme;
}

export function setStoredTheme(themeId: string): void {
  localStorage.setItem('selectedTheme', themeId);
} 