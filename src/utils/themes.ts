import { Theme } from '../types';

export const themes: Theme[] = [
  {
    id: 'default',
    name: 'Default Dark',
    description: 'The classic dark theme with blue accents',
    cssFile: 'themes/default.css',
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
    cssFile: 'themes/light.css',
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
    cssFile: 'themes/gruvbox-dark.css',
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
    cssFile: 'themes/nord.css',
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
    cssFile: 'themes/dracula.css',
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
    cssFile: 'themes/terminal-green.css',
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
    cssFile: 'themes/cyberpunk.css',
    preview: {
      primary: '#0a0a0a',
      secondary: '#1a0d1a',
      accent: '#00ffff'
    }
  },
  {
    id: 'github-light',
    name: 'GitHub Light',
    description: 'Clean light theme inspired by GitHub',
    cssFile: 'themes/github-light.css',
    preview: {
      primary: '#ffffff',
      secondary: '#f6f8fa',
      accent: '#0969da'
    }
  },
  {
    id: 'github-dark',
    name: 'GitHub Dark',
    description: 'Dark theme inspired by GitHub Dark',
    cssFile: 'themes/github-dark.css',
    preview: {
      primary: '#0d1117',
      secondary: '#161b22',
      accent: '#2f81f7'
    }
  },
  {
    id: 'github-dimmed',
    name: 'GitHub Dimmed',
    description: 'Softer dark theme with reduced contrast',
    cssFile: 'themes/github-dimmed.css',
    preview: {
      primary: '#22272e',
      secondary: '#2d333b',
      accent: '#539bf5'
    }
  },
  {
    id: 'vscode-dark',
    name: 'VS Code Dark',
    description: 'Popular VS Code editor dark theme',
    cssFile: 'themes/vscode-dark.css',
    preview: {
      primary: '#1e1e1e',
      secondary: '#252526',
      accent: '#007acc'
    }
  },
  {
    id: 'monokai',
    name: 'Monokai',
    description: 'Classic Monokai color scheme',
    cssFile: 'themes/monokai.css',
    preview: {
      primary: '#272822',
      secondary: '#383830',
      accent: '#a6e22e'
    }
  },
  {
    id: 'one-dark',
    name: 'One Dark',
    description: 'Atom\'s popular One Dark theme',
    cssFile: 'themes/one-dark.css',
    preview: {
      primary: '#282c34',
      secondary: '#2c313c',
      accent: '#61afef'
    }
  },
  {
    id: 'solarized-light',
    name: 'Solarized Light',
    description: 'Popular Solarized light color palette',
    cssFile: 'themes/solarized-light.css',
    preview: {
      primary: '#fdf6e3',
      secondary: '#eee8d5',
      accent: '#268bd2'
    }
  },
  {
    id: 'solarized-dark',
    name: 'Solarized Dark',
    description: 'Popular Solarized dark color palette',
    cssFile: 'themes/solarized-dark.css',
    preview: {
      primary: '#002b36',
      secondary: '#073642',
      accent: '#268bd2'
    }
  },
  {
    id: 'material-dark',
    name: 'Material Dark',
    description: 'Google\'s Material Design dark theme',
    cssFile: 'themes/material-dark.css',
    preview: {
      primary: '#121212',
      secondary: '#1e1e1e',
      accent: '#bb86fc'
    }
  },
  {
    id: 'oceanic-next',
    name: 'Oceanic Next',
    description: 'Blue-toned theme popular in editors',
    cssFile: 'themes/oceanic-next.css',
    preview: {
      primary: '#1b2b34',
      secondary: '#343d46',
      accent: '#6699cc'
    }
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night',
    description: 'Purple and blue tones inspired by Tokyo at night',
    cssFile: 'themes/tokyo-night.css',
    preview: {
      primary: '#1a1b26',
      secondary: '#24283b',
      accent: '#7aa2f7'
    }
  },
  {
    id: 'catppuccin-mocha',
    name: 'Catppuccin Mocha',
    description: 'Warm, cozy colors from the Catppuccin palette',
    cssFile: 'themes/catppuccin-mocha.css',
    preview: {
      primary: '#1e1e2e',
      secondary: '#181825',
      accent: '#89b4fa'
    }
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    description: 'Natural green tones for a calming experience',
    cssFile: 'themes/forest-green.css',
    preview: {
      primary: '#0d1b1e',
      secondary: '#1a2f35',
      accent: '#4caf50'
    }
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    description: 'Warm orange and red tones for vibrant energy',
    cssFile: 'themes/sunset-orange.css',
    preview: {
      primary: '#1a0e0a',
      secondary: '#2d1b14',
      accent: '#ff6b35'
    }
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    description: 'Deep blue tones for a professional appearance',
    cssFile: 'themes/midnight-blue.css',
    preview: {
      primary: '#0f1419',
      secondary: '#1a2332',
      accent: '#00bfff'
    }
  }
];

export const defaultTheme = 'default';

// Helper function to get the correct theme URL with base path
function getThemeUrl(cssFile: string): string {
  const baseUrl = import.meta.env.BASE_URL || '/';
  return `${baseUrl}${cssFile}`;
}

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
    // Fetch the CSS file from public folder with correct base path
    const themeUrl = getThemeUrl(theme.cssFile);
    const response = await fetch(themeUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch theme ${themeId} from ${themeUrl}`);
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