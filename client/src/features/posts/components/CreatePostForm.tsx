import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { createPost } from "../api/postsApi";

interface CreatePostFormProps {
  onPostCreated?: () => void; // callback to refresh feed
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onPostCreated }) => {
  const [heading, setHeading] = useState<string>("");
  const [markdown, setMarkdown] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = useSelector((state: RootState) => state.userAuth.accessToken);

  const handleCreatePost = async () => {
    if (!token) {
      setError("No auth token found");
      return;
    }
    if (!heading.trim() || !markdown.trim()) {
      setError("Heading and content are required");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await createPost({ heading, content: markdown }, token);
      console.log("Post created successfully");

      // refresh feed
      onPostCreated?.();

      setHeading("");
      setMarkdown("");
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold mb-2">Create a Post</h3>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <input
        type="text"
        value={heading}
        onChange={(e) => setHeading(e.target.value)}
        placeholder="Enter post heading"
        className="w-full mb-4 px-3 py-2 border rounded-md 
                   focus:outline-none focus:ring-2 focus:ring-gray-600"
      />

      <div className="max-w-full wrap-break-word whitespace-pre-wrap">
        <MDEditor
          value={markdown}
          onChange={(value) => setMarkdown(value || "")}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleCreatePost}
          disabled={loading}
          className="mt-4 px-4 py-2 rounded-md font-semibold 
                     bg-black text-white 
                     hover:bg-gray-900 
                     focus:ring-2 focus:ring-gray-600 
                     transition duration-200 shadow-lg
                     disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? "Posting..." : "Create Post"}
        </button>
      </div>
    </div>
  );
};

export default CreatePostForm;
