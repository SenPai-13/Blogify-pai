import React, { useState } from "react";
import Navbar from "../components/common/Navbar";
import Feed from "../features/posts/components/Feed";
import MyPosts from "../features/posts/components/MyPosts";
import CreatePostForm from "../features/posts/components/CreatePostForm";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"feed" | "myposts" | "create">(
    "feed"
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black flex">
        <div className="w-[20%]"></div>

        {/* Center content */}
        <div className="w-[60%] bg-black shadow-lg rounded-md text-white flex flex-col">
          {/* Toggle buttons */}
          <div className="flex mb-6 overflow-hidden">
            <button
              onClick={() => setActiveTab("feed")}
              className={`flex-1 px-4 py-2 font-semibold transition-colors duration-300 ${
                activeTab === "feed"
                  ? "bg-black text-white"
                  : "bg-black text-gray-300 hover:bg-gray-700"
              }`}>
              Feed
            </button>
            <button
              onClick={() => setActiveTab("myposts")}
              className={`flex-1 px-4 py-2 font-semibold transition-colors duration-300 ${
                activeTab === "myposts"
                  ? "bg-black text-white"
                  : "bg-black text-gray-300 hover:bg-gray-700"
              }`}>
              My Posts
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`flex-1 px-4 py-2 font-semibold transition-colors duration-300 ${
                activeTab === "create"
                  ? "bg-black text-white"
                  : "bg-black text-gray-300 hover:bg-gray-700"
              }`}>
              Create
            </button>
          </div>

          {/* Content area fills remaining space */}
          <div className="flex-1 p-6 overflow-y-60 bg-[#1E1E1E] border border-black rounded-4xl">
            {activeTab === "feed" && (
              <div key="feed" className="w-full h-full">
                <h2 className="text-xl font-bold mb-4">Feed</h2>
                <Feed />
              </div>
            )}

            {activeTab === "myposts" && (
              <div key="myposts" className="w-full h-full">
                <h2 className="text-xl font-bold mb-4">My Posts</h2>
                <MyPosts />
              </div>
            )}

            {activeTab === "create" && (
              <div key="create" className="w-full h-full">
                <h2 className="text-xl font-bold mb-4">Create Post</h2>
                <CreatePostForm />
              </div>
            )}
          </div>
        </div>

        <div className="w-[20%]"></div>
      </div>
    </>
  );
};

export default Dashboard;
