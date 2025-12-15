import mongoose, { Schema, Document } from "mongoose";

export interface IComment {
  populate(arg0: string, arg1: string): unknown;
  user: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPost extends Document {
  heading: string;
  content: string;
  author: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
  likesCount: number;
  liked?: boolean;
}

// Comment Schema
const commentSchema = new Schema<IComment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

// Auto-update `updatedAt` when comment changes
commentSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Post Schema
const postSchema = new Schema<IPost>(
  {
    heading: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
  },
  { timestamps: true }
);

// Virtual field for likesCount
postSchema.virtual("likesCount").get(function (this: IPost) {
  return this.likes.length;
});

// Ensure virtuals are included in JSON and object outputs
postSchema.set("toJSON", { virtuals: true });
postSchema.set("toObject", { virtuals: true });

export default mongoose.model<IPost>("Post", postSchema);
