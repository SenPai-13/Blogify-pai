import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { fetchMyPosts } from "../api/postsApi";
import FeedCard from "./FeedCard";
import type { Post } from "../../../types/post";

const MyPosts: React.FC = () => {
  const token = useSelector((state: RootState) => state.userAuth.accessToken);
  const [posts, setPosts] = useState<Post[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const loadMyPosts = async () => {
    if (!token) return;
    try {
      const data: Post[] = await fetchMyPosts(token);

      // Normalize backend response (guarantee likesCount & liked)
      const normalized = data.map((p) => ({
        ...p,
        likesCount: p.likesCount ?? p.likes?.length ?? 0,
        liked: p.liked ?? false,
      }));

      // Sort once (newest first)
      const sorted = normalized.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setPosts(sorted);
    } catch (err) {
      console.error("Error fetching my posts:", err);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    loadMyPosts();
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
        <p>Loading your posts...</p>
      ) : posts.length === 0 ? (
        <p>You haven’t created any posts yet.</p>
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

export default MyPosts;
