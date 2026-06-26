import React from "react";
import TeachingModeCard from "./TeachingModeCard";
import GroupStudyModeCard from "./GroupStudyModeCard";

const ConnectHomePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">
          Collaborative Workspace Rooms
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
          Create or join a session to start coding with your peers or guide students in real-time.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
        <TeachingModeCard/>
        <GroupStudyModeCard/>
      </div>
    </div>
  );
};

export default ConnectHomePage;
