import { BlogPost, SearchResult, SearchSnippet } from '../types';
import { parsePost } from './markdown';

// Helper function to get the correct content URL with base path
function getContentUrl(filename: string): string {
  const baseUrl = import.meta.env.BASE_URL || '/';
  return `${baseUrl}content/${filename}`;
}

// Content loader that reads from markdown files
export async function loadAllPosts(): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];

  // Use dynamic imports to ensure content files are included in the build
  const contentModules = import.meta.glob('/content/*.md', { as: 'raw' });

  for (const path in contentModules) {
    try {
      const content = await contentModules[path]() as string;
      const id = path.split('/').pop()?.replace('.md', '') || '';
      const post = parsePost(content, id);
      posts.push(post);
    } catch (error) {
      console.error(`Error loading post from ${path}:`, error);
    }
  }

  // Sort by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function loadPost(id: string): Promise<BlogPost | null> {
  try {
    // Try dynamic import first (for build-time inclusion)
    const contentModules = import.meta.glob('/content/*.md', { as: 'raw' });
    const targetPath = `/content/${id}.md`;

    if (contentModules[targetPath]) {
      const content = await contentModules[targetPath]() as string;
      return parsePost(content, id);
    }

    // Fallback to fetch for runtime loading (GitHub Pages)
    const contentUrl = getContentUrl(`${id}.md`);
    const response = await fetch(contentUrl);

    if (!response.ok) {
      console.error(`Failed to fetch post ${id} from ${contentUrl}`);
      return null;
    }

    const content = await response.text();
    return parsePost(content, id);
  } catch (error) {
    console.error(`Error loading post ${id}:`, error);
    return null;
  }
}

// Get all unique tags from posts
export function getAllTags(posts: BlogPost[]): string[] {
  const tagSet = new Set<string>();
  posts.forEach(post => {
    post.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

// Filter posts by search criteria
export function filterPosts(posts: BlogPost[], query: string, selectedTags: string[], tagFilterMode: 'AND' | 'OR' = 'OR'): BlogPost[] {
  return posts.filter(post => {
    // Text search in title, excerpt, and content
    const searchText = query.toLowerCase();
    const matchesText = !searchText ||
      post.title.toLowerCase().includes(searchText) ||
      post.excerpt.toLowerCase().includes(searchText) ||
      post.content.toLowerCase().includes(searchText);

    // Tag filtering with AND/OR support
    let matchesTags = true;
    if (selectedTags.length > 0) {
      if (tagFilterMode === 'AND') {
        // AND operation: post must have ALL selected tags
        matchesTags = selectedTags.every(tag => post.tags.includes(tag));
      } else {
        // OR operation: post must have ANY of the selected tags
        matchesTags = selectedTags.some(tag => post.tags.includes(tag));
      }
    }

    return matchesText && matchesTags;
  });
}

// Extract search snippets from text
function extractSnippets(text: string, searchTerm: string, maxLength: number = 120): SearchSnippet[] {
  const snippets: SearchSnippet[] = [];
  const lowerText = text.toLowerCase();
  const lowerSearchTerm = searchTerm.toLowerCase();

  let index = 0;
  while (index < lowerText.length) {
    const foundIndex = lowerText.indexOf(lowerSearchTerm, index);
    if (foundIndex === -1) break;

    // Calculate snippet boundaries
    const start = Math.max(0, foundIndex - Math.floor((maxLength - searchTerm.length) / 2));
    const end = Math.min(text.length, start + maxLength);

    // Extract the snippet
    let snippet = text.substring(start, end);

    // Add ellipsis if truncated
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';

    // Calculate highlight positions within the snippet
    const highlightStartInSnippet = foundIndex - start + (start > 0 ? 3 : 0); // Account for ellipsis
    const highlightEndInSnippet = highlightStartInSnippet + searchTerm.length;

    snippets.push({
      text: snippet,
      highlightStart: Math.max(0, highlightStartInSnippet),
      highlightEnd: Math.min(snippet.length, highlightEndInSnippet)
    });

    // Move to next potential match
    index = foundIndex + searchTerm.length;

    // Limit number of snippets per source
    if (snippets.length >= 3) break;
  }

  return snippets;
}

// Search posts and return results with snippets
export function searchPosts(posts: BlogPost[], query: string): SearchResult[] {
  if (!query.trim()) return [];

  const results: SearchResult[] = [];
  const searchTerm = query.trim();

  posts.forEach(post => {
    const titleMatch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const excerptMatch = post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const contentMatch = post.content.toLowerCase().includes(searchTerm.toLowerCase());

    if (titleMatch || excerptMatch || contentMatch) {
      const snippets: SearchSnippet[] = [];

      // Add title snippets if matched
      if (titleMatch) {
        snippets.push(...extractSnippets(post.title, searchTerm, 100));
      }

      // Add excerpt snippets if matched
      if (excerptMatch) {
        snippets.push(...extractSnippets(post.excerpt, searchTerm, 120));
      }

      // Add content snippets if matched (and not already found in title/excerpt)
      if (contentMatch && !titleMatch && !excerptMatch) {
        snippets.push(...extractSnippets(post.content, searchTerm, 150));
      }

      const matchType = titleMatch ? 'title' : excerptMatch ? 'excerpt' : 'content';

      results.push({
        post,
        snippets: snippets.slice(0, 2), // Limit to 2 snippets per result
        matchType
      });
    }
  });

  // Sort by relevance: title matches first, then excerpt, then content
  return results.sort((a, b) => {
    const order = { title: 0, excerpt: 1, content: 2 };
    return order[a.matchType] - order[b.matchType];
  });
} 