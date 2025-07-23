import { BlogPost, BlogMetadata } from '../types';
import katex from 'katex';

/**
 * Escape HTML entities to prevent XSS / unintended tag injections.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Apply base path to image URLs for GitHub Pages deployment
 */
function applyBasePath(src: string): string {
  // Only apply base path to assets that start with /assets/
  if (src.startsWith('/assets/')) {
    const baseUrl = import.meta.env.BASE_URL || '/';
    return `${baseUrl.replace(/\/$/, '')}${src}`;
  }
  // Return external URLs and other paths as-is
  return src;
}

/**
 * Utility that replaces a matched chunk with a unique placeholder token and stashes the
 * HTML output. Later, we restore all placeholders in a single pass. This prevents us
 * from accidentally re-processing code within code blocks or KaTeX output.
 */
function createStasher() {
  const store: string[] = [];
  function stash(html: string): string {
    const token = `@@PLACEHOLDER_${store.length}@@`;
    store.push(html);
    return token;
  }
  function restore(html: string): string {
    return store.reduce((acc, fragment, i) => acc.replace(`@@PLACEHOLDER_${i}@@`, fragment), html);
  }
  return { stash, restore };
}

/**
 * Convert a subset of Markdown to HTML.  
 * The implementation favours **safety** (HTML-escaping, XSS avoidance) and **predictability**
 * over full CommonMark compliance, keeping the bundle light (no heavy parsers).
 */
export function parseMarkdown(markdown: string): string {
  const { stash, restore } = createStasher();

  let html = markdown.trim();

  /**
   * 1. Code fences  ```lang\n...```
   *    – Stashed early so inner content is left untouched by later regexes.
   */
  html = html.replace(/```([a-z0-9]*)[\t ]*\n([\s\S]*?)```/gi, (_match, lang: string, code: string) => {
    const languageClass = lang ? ` class="language-${lang.toLowerCase()}"` : '';
    const escaped = escapeHtml(code.replace(/\n+$/, ''));
    return stash(`<pre><code${languageClass}>${escaped}</code></pre>`);
  });

  /**
   * 2. Display-mode LaTeX  $$...$$  (needs to come *before* inline math)
   */
  html = html.replace(/\$\$([\s\S]*?)\$\$/g, (_match, latex: string) => {
    try {
      return stash(katex.renderToString(latex.trim(), { displayMode: true, throwOnError: false }));
    } catch {
      return stash(`<div class="math-error">Math Error</div>`);
    }
  });

  /**
   * 3. Inline code  `code`
   */
  html = html.replace(/`([^`\n]+?)`/g, (_match, code: string) => `<code>${escapeHtml(code)}</code>`);

  /**
   * 4. Inline LaTeX  $x^2$  (after code, before formatting)
   */
  html = html.replace(/\$([^$\n]+?)\$/g, (_match, latex: string) => {
    try {
      return katex.renderToString(latex.trim(), { displayMode: false, throwOnError: false });
    } catch {
      return `<span class="math-error">Math Error</span>`;
    }
  });

  /**
   * 5. Headings (###### to #)
   */
  html = html.replace(/^###### +(.*)$/gm, '<h6>$1</h6>');
  html = html.replace(/^##### +(.*)$/gm, '<h5>$1</h5>');
  html = html.replace(/^#### +(.*)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### +(.*)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## +(.*)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# +(.*)$/gm, '<h1>$1</h1>');

  /**
   * 6. Horizontal rules (--- or ***)
   */
  html = html.replace(/^[ \t]*([-*])\1{2,}[ \t]*$/gm, '<hr />');

  /**
   * 7. Bold / italic / bold-italic  (uses negative lookaheads to avoid overlap)
   */
  html = html.replace(/\*\*\*([\s\S]+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([\s\S]+?)\*/g, '<em>$1</em>');

  /**
   * 8. Blockquotes (> ) – supports multi-line quotes.
   */
  html = html.replace(/^(> .+(?:\n> .+)*)/gm, (m) => {
    const stripped = m.replace(/^> /gm, '');
    return `<blockquote>${stripped}</blockquote>`;
  });

  /**
   * 9. Images with optional size/position: ![alt](src "title|small|left")
   */
  html = html.replace(/!\[([^\]]*)\]\(([^\s")]+)(?:\s+"([^"]+)")?\)/g, (_match, alt: string, src: string, attrs?: string) => {
    const classes: string[] = [];
    if (attrs) {
      attrs.split('|').forEach((a) => {
        const token = a.trim().toLowerCase();
        if (['small', 'medium', 'large', 'full', 'left', 'right', 'center'].includes(token)) {
          classes.push(`img-${token}`);
        }
      });
    }
    const cls = classes.length ? ` class="${classes.join(' ')}"` : '';
    return `<img src="${applyBasePath(src)}" alt="${escapeHtml(alt)}"${cls} />`;
  });

  /**
   * 10. Links [text](url)
   */
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  /**
   * 11. Lists – first mark <li> items, then wrap consecutive groups.
   */
  html = html.replace(/^\s*\* +(.*)$/gm, '<li class="bullet">$1</li>');
  html = html.replace(/^\s*(\d+)\. +(.*)$/gm, '<li class="numbered">$2</li>');

  // Wrap consecutive bullet list items in <ul>
  html = html.replace(/(<li class="bullet">.*?<\/li>(?:\n<li class="bullet">.*?<\/li>)*)/g, (match) => {
    const cleaned = match.replace(/ class="bullet"/g, '');
    return `<ul>${cleaned}</ul>`;
  });

  // Wrap consecutive numbered list items in <ol>
  html = html.replace(/(<li class="numbered">.*?<\/li>(?:\n<li class="numbered">.*?<\/li>)*)/g, (match) => {
    const cleaned = match.replace(/ class="numbered"/g, '');
    return `<ol>${cleaned}</ol>`;
  });

  /**
   * 12. Paragraphs & line breaks – split at double \n, then join.
   *     We skip wrapping if the line already contains a block element.
   */
  const blockRegex = /^(<\/?(?:h[1-6]|ul|ol|li|pre|code|blockquote|hr|img|p)[^>]*>)/i;
  html = html
    .split(/\n{2,}/)
    .map((seg) => (blockRegex.test(seg.trim()) ? seg : `<p>${seg.trim().replace(/\n/g, '<br />')}</p>`))
    .join('\n');

  /**
   * 13. Restore stashed fragments (code + KaTeX)
   */
  html = restore(html);

  return html;
}

/**
 * Parse YAML-style front-matter + content -> BlogPost
 */
export function parsePost(rawContent: string, id: string): BlogPost {
  // Separate front-matter (---) from body
  const match = rawContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  let front: Partial<BlogMetadata> = {};
  let body = rawContent;

  if (match) {
    const [, fm, rest] = match;
    body = rest;
    fm.split(/\n+/).forEach((line) => {
      const idx = line.indexOf(':');
      if (idx === -1) return;
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
      if (key === 'tags') {
        front.tags = val.split(',').map((t) => t.trim()).filter(Boolean);
      } else {
        (front as any)[key] = val;
      }
    });
  }

  // Remove first H1 from content to avoid duplicate titles
  const lines = body.split('\n');
  let i = 0;
  // Skip empty lines at the beginning
  while (i < lines.length && lines[i].trim() === '') {
    i++;
  }
  // Check if the first non-empty line is an H1
  if (i < lines.length && lines[i].trim().startsWith('# ')) {
    lines.splice(i, 1); // Remove the H1 line
    // Remove any immediately following empty lines
    while (i < lines.length && lines[i].trim() === '') {
      lines.splice(i, 1);
    }
    body = lines.join('\n');
  }

  const wordCount = body.split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return {
    id,
    title: front.title || 'Untitled',
    excerpt: front.excerpt || body.slice(0, 150).replace(/\n/g, ' ') + '...',
    content: parseMarkdown(body),
    date: front.date || new Date().toISOString().split('T')[0],
    tags: front.tags || [],
    author: front.author,
    readTime,
  };
}

/**
 * Pretty print ISO YYYY-MM-DD -> e.g. July 19, 2025
 */
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
