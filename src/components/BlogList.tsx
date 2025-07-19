import React from "react";
import { BlogPost } from "../types";
import { formatDate } from "../utils/markdown";

interface BlogListProps {
  posts: BlogPost[];
  onPostSelect: (postId: string) => void;
  onTagClick?: (tag: string) => void;
  loading: boolean;
}

const BlogList: React.FC<BlogListProps> = ({
  posts,
  onPostSelect,
  onTagClick,
  loading,
}) => {
  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="no-posts">
        <p>No posts found. Try adjusting your search or filters.</p>
      </div>
    );
  }

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  // Calculate estimated word count for better read time display
  const getReadTimeDisplay = (readTime?: number) => {
    if (!readTime) return "Quick read";
    if (readTime === 1) return "1 min read";
    return `${readTime} min read`;
  };

  return (
    <div className="blog-list">
      {posts.map((post) => (
        <article
          key={post.id}
          className="blog-card"
          onClick={() => onPostSelect(post.id)}
        >
          <div className="blog-card-header">
            <div className="blog-card-meta">
              <time className="blog-card-date" dateTime={post.date}>
                {formatDate(post.date)}
              </time>
              <span className="meta-separator">•</span>
              <span className="blog-card-read-time">
                {getReadTimeDisplay(post.readTime)}
              </span>
            </div>
            {post.author && (
              <div className="blog-card-author">
                <span className="author-label">by</span>
                <span className="author-name">{post.author}</span>
              </div>
            )}
          </div>

          <div className="blog-card-content">
            <h2 className="blog-card-title">{post.title}</h2>
            <p className="blog-card-excerpt">{post.excerpt}</p>
          </div>

          {post.tags.length > 0 && (
            <div className="blog-card-tags">
              {post.tags.slice(0, 3).map((tag) => (
                <button
                  key={tag}
                  className="blog-card-tag"
                  onClick={(e) => handleTagClick(e, tag)}
                  title={`Filter by ${tag}`}
                >
                  #{tag}
                </button>
              ))}
              {post.tags.length > 3 && (
                <span className="blog-card-tag-more">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </article>
      ))}
    </div>
  );
};

export default BlogList;
