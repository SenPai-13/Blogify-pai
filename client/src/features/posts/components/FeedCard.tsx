import React, { useState } from "react";
import { FaEllipsisH, FaComment } from "react-icons/fa";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { updatePost, deletePost } from "../api/postsApi";
import ReactMarkdown from "react-markdown";
import type { Post } from "../../../types/post";
import LikeButton from "./LikeButton";
import api from "../../../lib/api";

interface FeedCardProps {
  post: Post;
  onPostUpdated?: (updatedPost: Post) => void;
  onPostDeleted?: (id: string) => void;
}

const formatTimeAgo = (dateString: string) => {
  const created = new Date(dateString).getTime();
  const now = Date.now();
  const diffMs = now - created;

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffHr < 1) return `${diffMin}m`;
  if (diffHr < 24) return `${diffHr}h`;
  return `${diffDay}d`;
};
const FeedCard: React.FC<FeedCardProps> = ({
  post,
  onPostUpdated,
  onPostDeleted,
}) => {
  const token = useSelector((state: RootState) => state.userAuth.accessToken);
  const user = useSelector((state: RootState) => state.userAuth.user);

  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editHeading, setEditHeading] = useState(post.heading);
  const [editContent, setEditContent] = useState(post.content);
  const [showComments, setShowComments] = useState(false);

  // 🔹 Comment state
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post.comments || []);

  const isAuthor = user && post.author?._id === user.id;

  const handleUpdate = async () => {
    if (!token) return;
    const updated = await updatePost(
      post._id,
      { heading: editHeading, content: editContent },
      token
    );
    onPostUpdated?.(updated);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!token) return;
    await deletePost(post._id, token);
    onPostDeleted?.(post._id);
  };

  // Add comment
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !commentText.trim()) return;

    try {
      const res = await api.post(
        `/api/posts/${post._id}/comments`, // ✅ plural
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) => [res.data, ...prev]);
      setCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    if (!token) return;
    try {
      await api.delete(
        `/api/posts/${post._id}/comments/${commentId}`, // ✅ plural
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };
  return (
    <div className="bg-[#1E1E1E] text-white border border-[#1E1E1E] shadow-md mb-10 p-4 rounded-lg">
      {/* Top section */}
      <div className="flex justify-between items-start">
        {/* Avatar + Heading */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
            <span className="text-white font-bold">
              {post.author?.username?.charAt(0).toUpperCase() || "?"}
            </span>
          </div>
          <div>
            {editing ? (
              <input
                type="text"
                value={editHeading}
                onChange={(e) => setEditHeading(e.target.value)}
                className="w-full mb-2 px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
              />
            ) : (
              <h2 className="text-lg font-semibold">{post.heading}</h2>
            )}
            <p className="text-xs text-gray-400">
              {formatTimeAgo(post.createdAt)}
            </p>
          </div>
        </div>

        {/* Three dots menu */}
        {isAuthor && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-400 hover:text-white">
              <FaEllipsisH />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-28 bg-gray-800 border border-gray-700 shadow-lg z-10">
                <button
                  onClick={() => {
                    setEditing(true);
                    setMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-gray-700">
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleDelete();
                    setMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-sm text-left text-red-500 hover:bg-gray-700">
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post content */}
      <div className="mt-3 ml-12 text-gray-300 whitespace-pre-wrap wrap-break-word">
        {editing ? (
          <>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full mb-2 px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
            />
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                Cancel
              </button>
            </div>
          </>
        ) : (
          <ReactMarkdown
            components={{
              img: ({ node, ...props }) => (
                <img
                  {...props}
                  className="rounded-lg my-2 max-w-full border border-gray-700"
                  alt={props.alt || "image"}
                />
              ),
            }}>
            {post.content}
          </ReactMarkdown>
        )}
      </div>
      {/* Bottom actions */}
      <div className="mt-3 ml-12 flex gap-6 text-gray-400">
        <LikeButton post={post} token={token} onPostUpdated={onPostUpdated} />

        <div
          className="flex items-center gap-1 hover:text-blue-400 cursor-pointer"
          onClick={() => setShowComments((prev) => !prev)}>
          <FaComment />
          <span className="text-sm">{comments?.length || 0}</span>
        </div>
      </div>

      {/* Comment section */}
      {showComments && (
        <div className="mt-4 ml-12">
          <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-4">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border rounded px-3 py-2 bg-gray-800 text-white"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Post
            </button>
          </form>

          <ul className="space-y-2">
            {comments?.map((c) => (
              <li
                key={c._id}
                className="flex justify-between items-center bg-gray-800 px-3 py-2 rounded">
                <div>
                  <span className="font-semibold">{c.user?.username}</span>:{" "}
                  {c.text}
                  <span className="text-xs text-gray-400 ml-2">
                    {formatTimeAgo(c.createdAt)}
                  </span>
                </div>
                {user?.id === c.user?._id && (
                  <button
                    onClick={() => handleDeleteComment(c._id)}
                    className="text-red-500 hover:underline text-xs">
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FeedCard;
