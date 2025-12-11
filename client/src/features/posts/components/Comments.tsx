import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { FaTrash } from "react-icons/fa";

interface Comment {
  _id: string;
  text: string;
  user: { _id: string; username: string; email: string };
  createdAt: string;
  updatedAt: string;
}

const Comments: React.FC<{ postId: string }> = ({ postId }) => {
  const token = useSelector((state: RootState) => state.userAuth.accessToken);
  const user = useSelector((state: RootState) => state.userAuth.user);

  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");

  const loadComments = async () => {
    try {
      const res = await axios.get(`/api/posts/${postId}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // ✅ backend must populate comments.user
      setComments(res.data.comments || res.data);
    } catch (err) {
      console.error("Error loading comments:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <div className="mt-4">
      {/* Comment input */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded">
          Post
        </button>
      </form>

      {/* Comments list */}
      <ul className="space-y-2">
        {comments.map((c) => (
          <li key={c._id} className="flex justify-between items-center">
            <div>
              <span className="font-semibold">{c.user?.username}</span>:{" "}
              {c.text}
              <span className="text-xs text-gray-500 ml-2">
                {new Date(c.createdAt).toLocaleString()}
              </span>
            </div>
            {user?.id === c.user._id && (
              <button
                onClick={() => handleDelete(c._id)}
                className="text-red-500 hover:text-red-700">
                <FaTrash size={14} />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;
