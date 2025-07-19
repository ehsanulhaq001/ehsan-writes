export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  tags: string[];
  readTime?: number;
  author?: string;
}

export interface BlogMetadata {
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  author?: string;
}

export interface SearchParams {
  query: string;
  selectedTags: string[];
}

export interface SearchSnippet {
  text: string;
  highlightStart: number;
  highlightEnd: number;
}

export interface SearchResult {
  post: BlogPost;
  snippets: SearchSnippet[];
  matchType: 'title' | 'excerpt' | 'content';
}

// Theme types
export interface Theme {
  id: string;
  name: string;
  description: string;
  cssFile: string;
  preview: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface ThemeContextType {
  currentTheme: string;
  themes: Theme[];
  setTheme: (themeId: string) => void;
  loading: boolean;
} 