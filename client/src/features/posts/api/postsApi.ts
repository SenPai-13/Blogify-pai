import api from "../../../lib/axios";
import type { Post } from "../../../types/post";

// Fetch all posts
export const fetchPosts = async (token: string | null): Promise<Post[]> => {
  if (!token) throw new Error("No auth token found");
  const response = await api.get<Post[]>("/api/posts", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Fetch only my posts
export const fetchMyPosts = async (token: string | null): Promise<Post[]> => {
  if (!token) throw new Error("No auth token found");
  const response = await api.get<Post[]>("/api/posts/mine", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Create a new post
export const createPost = async (
  postData: { heading: string; content: string },
  token: string
): Promise<Post> => {
  const response = await api.post<Post>("/api/posts", postData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update a post
export const updatePost = async (
  id: string,
  postData: { heading?: string; content?: string },
  token: string
): Promise<Post> => {
  const response = await api.put<Post>(`/api/posts/${id}`, postData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Delete a post
export const deletePost = async (
  id: string,
  token: string
): Promise<{ success: boolean }> => {
  const response = await api.delete<{ success: boolean }>(`/api/posts/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Toggle like
export const toggleLike = async (
  id: string,
  token: string
): Promise<{ likesCount: number; liked: boolean }> => {
  const response = await api.post<{ likesCount: number; liked: boolean }>(
    `/api/posts/${id}/like`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  console.log("likes data:", response.data);
  return response.data;
};

// Fetch a single post by ID
export async function fetchPostById(
  postId: string,
  token: string
): Promise<Post> {
  const response = await api.get<Post>(`/api/posts/${postId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
// Add a comment to a post
export const addComment = async (
  postId: string,
  text: string,
  token: string
): Promise<Comment> => {
  const response = await api.post<Comment>(
    `/api/posts/${postId}/comment`,
    { text },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Get all comments for a post
export const fetchComments = async (
  postId: string,
  token: string
): Promise<Comment[]> => {
  const response = await api.get<Comment[]>(`/api/posts/${postId}/comment`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Delete a comment
export const deleteComment = async (
  postId: string,
  commentId: string,
  token: string
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    `/api/posts/${postId}/comment/${commentId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
