import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { fetchPosts } from "../api/postsApi";
import FeedCard from "./FeedCard";
import type { Post } from "../../../types/post";

const Feed: React.FC = () => {
  const token = useSelector((state: RootState) => state.userAuth.accessToken);
  const [posts, setPosts] = useState<Post[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const loadPosts = async () => {
    if (!token) return;
    try {
      const postsArray = await fetchPosts(token);

      const sorted = postsArray.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setPosts(sorted);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [token]);

  const handlePostUpdated = (updated: Post) => {
    setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
  };

  const handlePostDeleted = (id: string) => {
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div>
      {initialLoading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 mt-4">
          No posts yet. Be the first to share!
        </p>
      ) : (
        posts.map((post) => (
          <FeedCard
            key={post._id}
            post={post}
            onPostUpdated={handlePostUpdated}
            onPostDeleted={handlePostDeleted}
          />
        ))
      )}
    </div>
  );
};

export default Feed;
