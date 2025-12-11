import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { toggleLike } from "../api/postsApi";
import type { Post } from "../../../types/post";

interface LikeButtonProps {
  post: Post;
  token: string | null;
  onPostUpdated?: (updatedPost: Post) => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  post,
  token,
  onPostUpdated,
}) => {
  const [likesCount, setLikesCount] = useState<number>(post.likesCount ?? 0);
  const [isLiked, setIsLiked] = useState<boolean>(post.liked ?? false);

  const handleToggleLike = async () => {
    if (!token) return;

    try {
      const data = await toggleLike(post._id, token);

      // ✅ Trust backend response only
      setIsLiked(data.liked);
      setLikesCount(data.likesCount);

      onPostUpdated?.({
        ...post,
        liked: data.liked,
        likesCount: data.likesCount,
      });
    } catch (err) {
      console.error("Like API failed:", err);
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      className={`flex items-center gap-1 ${
        isLiked ? "text-red-500" : "hover:text-red-500"
      }`}>
      <FaHeart /> <span className="text-sm">{likesCount}</span>
    </button>
  );
};

export default LikeButton;
