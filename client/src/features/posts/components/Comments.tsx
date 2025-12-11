import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { FaTrash } from "react-icons/fa";

export interface CommentType {
  _id: string;
  user: {
    _id: string; // backend ID
    username: string;
    email: string;
  };
  text: string;
  createdAt: string;
  updatedAt: string;
}

const Comments: React.FC<{ postId: string }> = ({ postId }) => {
  const token = useSelector((state: RootState) => state.userAuth.accessToken);
  const user = useSelector((state: RootState) => state.userAuth.user);

  const [comments, setComments] = useState<CommentType[]>([]);
  const [text, setText] = useState("");

  const loadComments = async () => {
    try {
      const res = await axios.get(`/api/posts/${postId}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(res.data.comments || res.data);
    } catch (err) {
      console.error("Error loading comments:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await axios.post(
        `/api/posts/${postId}/comments`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) => [res.data, ...prev]);
      setText("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/posts/${postId}/comments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  // Simple "time ago" formatter
  const formatTimeAgo = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="mt-6">
      {/* Comment input */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
          Post
        </button>
      </form>

      {/* Comments list */}
      <ul className="space-y-4">
        {comments.map((c) => (
          <li
            key={c._id}
            className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition relative">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm">
              {c.user.username[0]?.toUpperCase() || "U"}
            </div>

            {/* Comment content */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-800">
                  {c.user.username}
                </span>
                <span className="text-xs text-gray-400">
                  {formatTimeAgo(c.createdAt)}
                </span>
              </div>
              <p className="text-gray-700 mt-1">{c.text}</p>
            </div>

            {/* Delete button */}
            {user?.id === c.user._id && (
              <button
                onClick={() => handleDelete(c._id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-0 hover:opacity-100 transition">
                <FaTrash size={16} />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;
