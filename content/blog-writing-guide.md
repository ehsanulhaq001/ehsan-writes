---
title: Blog Writing Guide - Everything You Need to Know
excerpt: Complete guide to writing and formatting blog posts on this site, including markdown features, images, math support, themes, and advanced capabilities
date: 2025-07-23
tags: guide, writing, markdown, tutorial, documentation
author: Ehsan Ul Haq Khawja
---

# Blog Writing Guide - Everything You Need to Know

Welcome to the complete guide for creating amazing blog posts on this site! This guide covers everything from basic formatting to advanced features like mathematical equations, custom image positioning, and theme integration.

## 📝 Getting Started

### Creating a New Blog Post

1. Create a new `.md` file in the `/content` folder
2. Use a descriptive filename (it becomes your URL slug)
3. Start with frontmatter metadata
4. Write your content in markdown below

**Example filename**: `my-awesome-post.md` → URL: `/blog/my-awesome-post`

### Required File Structure

```
content/
├── your-post-name.md    ← Your blog post
└── ...other posts
```

## 🏷️ Frontmatter Metadata

Every blog post **must** start with YAML frontmatter between `---` markers:

```yaml
---
title: Your Post Title
excerpt: A brief description that appears in the blog list and search results
date: 2024-01-21
tags: tag1, tag2, tag3, tutorial
author: Your Name
---
```

### Frontmatter Fields

| Field     | Required | Description                                    | Example                                   |
| --------- | -------- | ---------------------------------------------- | ----------------------------------------- |
| `title`   | ✅       | Post title (appears in header and browser tab) | `"How to Build a React App"`              |
| `excerpt` | ✅       | Brief description for previews and SEO         | `"Learn the basics of React development"` |
| `date`    | ✅       | Publication date in YYYY-MM-DD format          | `2024-01-21`                              |
| `tags`    | ✅       | Comma-separated list for categorization        | `react, javascript, tutorial`             |
| `author`  | ✅       | Author name                                    | `"Jane Doe"`                              |

## 📖 Markdown Features

### Headers

```markdown
# H1 - Main Title (auto-removed from content if first line)

## H2 - Section Header

### H3 - Subsection

#### H4 - Sub-subsection

##### H5 - Minor header

###### H6 - Smallest header
```

### Text Formatting

```markdown
**Bold text**
_Italic text_
**_Bold and italic_**
`inline code`
~~Strikethrough~~ (not supported)
```

### Links

```markdown
[Link text](https://example.com)
[Internal link](https://yourdomain.com/other-post)
```

**Note**: All external links automatically open in new tabs with security attributes.

### Lists

**Unordered Lists:**

```markdown
- First item
- Second item
  - Nested item (manual indentation)
- Third item
```

**Ordered Lists:**

```markdown
1. First step
2. Second step
3. Third step
```

### Blockquotes

```markdown
> This is a blockquote. Perfect for highlighting important information,
> quotes, or key takeaways from your content.
```

### Horizontal Rules

```markdown
---
---
```

Both create horizontal dividers.

## 💻 Code Blocks

### Inline Code

```markdown
Use `console.log()` to debug your code.
```

### Code Blocks with Syntax Highlighting

````markdown
```javascript
function greetUser(name) {
  console.log(`Hello, ${name}!`);
  return `Welcome to the blog, ${name}`;
}

greetUser("Developer");
```
````

**Supported Languages**: javascript, typescript, python, java, css, html, bash, sql, json, yaml, and many more.

### Code Block Best Practices

- Always specify the language for syntax highlighting
- Keep code examples concise and relevant
- Add comments to explain complex logic
- Test your code before publishing

## 🖼️ Images

### Basic Image Syntax

```markdown
![Alt text](image-url)
![Alt text](image-url "Optional title")
```

### Image Storage

Store images in:

- `/assets/images/` for development
- They'll be copied to `/public/assets/images/` for production

### Advanced Image Features

This blog supports special image attributes for sizing and positioning:

```markdown
![Alt text](/assets/images/my-image.png "title|size|position")
```

**Size Options:**

- `small` - Reduced size
- `medium` - Default size
- `large` - Larger display
- `full` - Full width

**Position Options:**

- `left` - Float left with text wrap
- `right` - Float right with text wrap
- `center` - Center alignment

**Examples:**

```markdown
![Diagram](/assets/images/diagram.png "small|right")
![Hero image](/assets/images/hero.jpg "large|center")
![Thumbnail](/assets/images/thumb.png "small|left")
```

### Image Best Practices

- Use descriptive alt text for accessibility
- Optimize images (compress for web)
- Use appropriate file formats (PNG for graphics, JPG for photos)
- Include relevant images to break up text

## 🔢 Mathematical Expressions

The blog supports LaTeX math rendering via KaTeX!

### Inline Math

```markdown
The formula for energy is $E = mc^2$.
The quadratic formula is $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$.
```

### Display Math (Block)

```markdown
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

$$
\begin{aligned}
\nabla \times \vec{\mathbf{B}} &= \mu_0\vec{\mathbf{J}} + \mu_0\epsilon_0 \frac{\partial\vec{\mathbf{E}}}{\partial t} \\
\nabla \cdot \vec{\mathbf{E}} &= \frac {\rho} {\epsilon_0} \\
\nabla \times \vec{\mathbf{E}} &= -\frac{\partial\vec{\mathbf{B}}}{\partial t} \\
\nabla \cdot \vec{\mathbf{B}} &= 0
\end{aligned}
$$
```

### Math Examples

**Inline**: $f(x) = x^2 + 2x + 1$

**Block**:

$$
\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}
$$

## 🎨 Themes and Styling

The blog supports 22+ beautiful themes that readers can switch between:

### Available Themes

**Dark Themes:**

- Default, Cyberpunk, Terminal Green, Dracula
- Midnight Blue, Material Dark, One Dark, Monokai
- VSCode Dark, GitHub Dark, Nord, Gruvbox Dark
- Solarized Dark, Tokyo Night, Oceanic Next, Catppuccin Mocha

**Light Themes:**

- Light, GitHub Light, Solarized Light

**Colorful Themes:**

- Sunset Orange, Forest Green, GitHub Dimmed

### Theme Considerations

- Your content works with all themes automatically
- High contrast maintained for accessibility
- Code blocks adapt to theme colors
- No theme-specific styling needed in posts

## 🔍 Search and Discovery

### Tags

Use strategic tagging to help readers find your content:

```yaml
tags: javascript, react, tutorial, beginners, frontend
```

**Tag Best Practices:**

- Use 3-7 relevant tags per post
- Include broad categories (`programming`, `tutorial`)
- Add specific technologies (`react`, `python`)
- Consider skill levels (`beginner`, `advanced`)
- Use consistent tag naming

### Search Features

The blog includes:

- **Full-text search** across all content
- **Tag filtering** with AND/OR operations
- **Search result snippets** with highlighting
- **Real-time search** as users type

## 🔊 Text-to-Speech

**Automatic Feature**: Every blog post includes text-to-speech capability!

Readers can:

- Play/pause audio narration
- Adjust playback speed (0.5x to 2x)
- Choose from multiple voices
- View reading progress
- Control audio from a floating panel

**Content Considerations:**

- Write in a conversational tone for better audio experience
- Use clear, simple sentences
- Consider how abbreviations sound when spoken
- Test complex mathematical expressions for audio clarity

## 📱 Responsive Design

Your content automatically adapts to all screen sizes:

- Mobile-first responsive layout
- Touch-friendly navigation
- Optimized typography scaling
- Accessible color contrasts

## ✅ Content Best Practices

### Writing Quality

- Write engaging, scannable content
- Use headers to break up long sections
- Include practical examples and code samples
- Add relevant images to illustrate concepts

### SEO Optimization

- Write descriptive titles (50-60 characters)
- Create compelling excerpts (150-160 characters)
- Use relevant tags consistently
- Include internal links to related posts

### Accessibility

- Use descriptive alt text for images
- Structure content with proper headers
- Write clear, concise language
- Test with text-to-speech feature

### Performance

- Optimize images before uploading
- Keep posts focused and well-structured
- Use code blocks efficiently
- Test loading speed

## 🚀 Publishing Checklist

Before publishing your blog post:

**Content:**

- [ ] Frontmatter includes all required fields
- [ ] Title is descriptive and engaging
- [ ] Excerpt summarizes the post well
- [ ] Tags are relevant and consistent
- [ ] Date is correct (YYYY-MM-DD format)

**Formatting:**

- [ ] Headers create logical structure
- [ ] Code blocks have proper syntax highlighting
- [ ] Images have descriptive alt text
- [ ] Math equations render correctly
- [ ] Links work and open appropriately

**Quality:**

- [ ] Content is proofread
- [ ] Examples are tested and working
- [ ] Images are optimized and relevant
- [ ] Post provides value to readers

## 📝 Example Post Template

Here's a complete template to get you started:

````markdown
---
title: Your Descriptive Post Title
excerpt: A compelling summary that makes readers want to click and read more
date: 2024-01-21
tags: relevant, tags, here, tutorial
author: Your Name
---

# Your Post Title

Brief introduction paragraph that hooks the reader and explains what they'll learn.

## Main Section Header

Your content here with **bold text**, _italic text_, and `inline code`.

### Subsection

Include practical examples:

```javascript
const example = "This is sample code";
console.log(example);
```
````

## Another Section

![Relevant image](/assets/images/your-image.png "medium|center")

Add blockquotes for important information:

> Key insight or important quote that adds value to your content.

## Mathematical Content (if relevant)

The relationship can be expressed as $y = mx + b$.

For more complex equations:

$$
\int_0^1 x^2 dx = \frac{1}{3}
$$

## Conclusion

Summarize key points and provide next steps or further reading suggestions.

Happy blogging! 🎉

```

## 🤝 Getting Help

If you need assistance:
1. Check this guide for formatting questions
2. Look at existing posts for examples
3. Test math expressions with online KaTeX editors
4. Validate markdown with online markdown viewers

Remember: The goal is to create valuable, well-formatted content that provides a great reading experience across all devices and themes!
```
