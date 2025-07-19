import { BlogPost, SearchResult, SearchSnippet } from '../types';
import { parsePost } from './markdown';

// Content loader that reads from markdown files
export async function loadAllPosts(): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];

  // In a Vite/browser environment, we need to import the files statically
  // This is a limitation of running in the browser - we can't dynamically read the filesystem
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
    // Use dynamic import to load the specific markdown file
    const contentModules = import.meta.glob('/content/*.md', { as: 'raw' });
    const targetPath = `/content/${id}.md`;

    if (contentModules[targetPath]) {
      const content = await contentModules[targetPath]() as string;
      return parsePost(content, id);
    }

    return null;
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
export function filterPosts(posts: BlogPost[], query: string, selectedTags: string[]): BlogPost[] {
  return posts.filter(post => {
    // Text search in title, excerpt, and content
    const searchText = query.toLowerCase();
    const matchesText = !searchText ||
      post.title.toLowerCase().includes(searchText) ||
      post.excerpt.toLowerCase().includes(searchText) ||
      post.content.toLowerCase().includes(searchText);

    // Tag filtering
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.some(tag => post.tags.includes(tag));

    return matchesText && matchesTags;
  });
}

// Extract text snippets around search terms
export function extractSnippets(text: string, searchTerm: string, maxLength: number = 150): SearchSnippet[] {
  if (!searchTerm.trim()) return [];

  const lowerText = text.toLowerCase();
  const lowerSearchTerm = searchTerm.toLowerCase();
  const snippets: SearchSnippet[] = [];

  let searchIndex = 0;
  while (searchIndex < lowerText.length) {
    const foundIndex = lowerText.indexOf(lowerSearchTerm, searchIndex);
    if (foundIndex === -1) break;

    // Calculate snippet boundaries
    const snippetStart = Math.max(0, foundIndex - Math.floor((maxLength - searchTerm.length) / 2));
    const snippetEnd = Math.min(text.length, snippetStart + maxLength);

    // Adjust start to avoid cutting words
    let adjustedStart = snippetStart;
    if (adjustedStart > 0 && text[adjustedStart] !== ' ') {
      const wordStart = text.lastIndexOf(' ', adjustedStart);
      if (wordStart !== -1 && wordStart > foundIndex - maxLength / 2) {
        adjustedStart = wordStart + 1;
      }
    }

    // Adjust end to avoid cutting words
    let adjustedEnd = snippetEnd;
    if (adjustedEnd < text.length && text[adjustedEnd] !== ' ') {
      const wordEnd = text.indexOf(' ', adjustedEnd);
      if (wordEnd !== -1 && wordEnd < foundIndex + maxLength / 2) {
        adjustedEnd = wordEnd;
      }
    }

    const snippetText = text.slice(adjustedStart, adjustedEnd);
    const highlightStart = foundIndex - adjustedStart;
    const highlightEnd = highlightStart + searchTerm.length;

    snippets.push({
      text: snippetText,
      highlightStart: Math.max(0, highlightStart),
      highlightEnd: Math.min(snippetText.length, highlightEnd)
    });

    searchIndex = foundIndex + searchTerm.length;

    // Limit to 3 snippets per field
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