import React, { useState } from "react";
import { BlogPost } from "../types";
import { formatDate } from "../utils/markdown";
import TextToSpeech from "./TextToSpeech";

interface BlogPostViewProps {
  post: BlogPost;
  onBack: () => void;
  loading: boolean;
}

const BlogPostView: React.FC<BlogPostViewProps> = ({
  post,
  onBack,
  loading,
}) => {
  const [showAudioPanel, setShowAudioPanel] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  if (loading) {
    return <div className="loading">Loading post...</div>;
  }

  return (
    <article className="blog-post">
      <header className="post-header">
        <h1 className="post-title">{post.title}</h1>

        <div className="post-meta">
          <div className="meta-group">
            <time className="post-date">{formatDate(post.date)}</time>
            <span className="meta-divider">•</span>
            <span className="read-time">{post.readTime} min read</span>
            {post.author && (
              <>
                <span className="meta-divider">•</span>
                <span className="author">by {post.author}</span>
              </>
            )}
          </div>

          <div className="meta-bottom">
            {post.tags.length > 0 && (
              <div className="post-tags">
                {post.tags.map((tag) => (
                  <span key={tag} className="post-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <TextToSpeech
              content={post.content}
              title={post.title}
              showPanel={showAudioPanel}
              setShowPanel={setShowAudioPanel}
              setIsPlaying={setIsAudioPlaying}
            />
          </div>
        </div>
      </header>

      {showAudioPanel && (
        <div className="audio-controls-panel">
          <TextToSpeech
            content={post.content}
            title={post.title}
            panelMode={true}
            showPanel={showAudioPanel}
            setShowPanel={setShowAudioPanel}
            setIsPlaying={setIsAudioPlaying}
          />
        </div>
      )}

      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
};

export default BlogPostView;
