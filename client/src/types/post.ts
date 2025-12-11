export interface Comment {
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
  };
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  heading: string;
  content: string;
  author: {
    _id: string;
    username: string;
    email: string;
  };
  comments: Comment[];
  likes: string[];
  likesCount: number;
  liked: boolean;
  createdAt: string;
  updatedAt: string;
}
