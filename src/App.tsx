import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { BlogPost, SearchParams } from "./types";
import {
  loadAllPosts,
  loadPost,
  getAllTags,
  filterPosts,
} from "./utils/content";
import Header from "./components/Header.tsx";
import BlogList from "./components/BlogList.tsx";
import BlogPostView from "./components/BlogPostView.tsx";
import SearchBar from "./components/SearchBar.tsx";
import Footer from "./components/Footer.tsx";
import ThemeSelector from "./components/ThemeSelector.tsx";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";

// Home page component
const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: "",
    selectedTags: [],
  });
  const navigate = useNavigate();

  // Load all posts on mount
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const allPosts = await loadAllPosts();
        setPosts(allPosts);
        setAllTags(getAllTags(allPosts));
      } catch (err) {
        setError("Failed to load blog posts");
        console.error("Error loading posts:", err);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  // Handle post selection
  const handlePostSelect = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchParams((prev) => ({ ...prev, query }));
  };

  // Handle tag selection
  const handleTagSelect = (tag: string) => {
    setSearchParams((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter((t) => t !== tag)
        : [...prev.selectedTags, tag],
    }));
  };

  // Handle tag click from blog cards
  const handleTagClick = (tag: string) => {
    setSearchParams((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags
        : [...prev.selectedTags, tag],
    }));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchParams({ query: "", selectedTags: [] });
  };

  // Filter posts based on selected tags only (not text search)
  const filteredPosts = filterPosts(
    posts,
    "", // Don't filter by text query anymore - handled by dropdown
    searchParams.selectedTags
  );

  if (loading) {
    return (
      <div className="container">
        <Header compact={false} />
        <div className="loading">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <Header compact={false} />

      {error && <div className="error">{error}</div>}

      <SearchBar
        query={searchParams.query}
        onSearch={handleSearch}
        availableTags={allTags}
        selectedTags={searchParams.selectedTags}
        onTagToggle={handleTagSelect}
        posts={posts}
        onPostSelect={handlePostSelect}
      />

      <BlogList
        posts={filteredPosts}
        onPostSelect={handlePostSelect}
        loading={loading}
        onTagClick={handleTagClick}
      />
    </div>
  );
};

// Blog post page component
const BlogPostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBlogPost = async () => {
      if (!postId) {
        setError("Post ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const loadedPost = await loadPost(postId);
        if (loadedPost) {
          setPost(loadedPost);
          // Set page title for better SEO and browser tab
          document.title = `${loadedPost.title} | Ehsan Writes`;
        } else {
          setError("Post not found");
        }
      } catch (err) {
        setError("Failed to load post");
        console.error("Error loading post:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBlogPost();
  }, [postId]);

  const handleBack = () => {
    // Reset page title
    document.title = "Ehsan Writes";
    navigate("/");
  };

  return (
    <div className="container">
      <Header compact={true} />

      {error && (
        <div className="error">
          {error}
          <button onClick={handleBack} style={{ marginLeft: "1rem" }}>
            Back to posts
          </button>
        </div>
      )}

      {post && (
        <BlogPostView post={post} onBack={handleBack} loading={loading} />
      )}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ThemeSelector />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:postId" element={<BlogPostPage />} />
      </Routes>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
