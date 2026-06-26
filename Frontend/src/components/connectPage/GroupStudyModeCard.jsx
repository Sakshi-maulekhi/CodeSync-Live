import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useSocket from "../hooks/useSocket";
import GlobalContext from "../../context/GlobalContext";
import LoginToContinue from "../room/LoginToContinue";

const GroupStudyModeCard = () => {
  const { setRoomId, loggedIn , setShowLoginToContinueModal} = useContext(GlobalContext);
  const navigate = useNavigate();
  const connectToRoom = useSocket();

  const shareableLink = useRef("");

  const handleCreateRoom = () => {
    if(!loggedIn){
        setShowLoginToContinueModal(true); 
        return;
    } 
        
    const newGroupStudyModeId = Math.random().toString(36).substring(2, 10); // Generate new room ID
    console.log(newGroupStudyModeId);
    setRoomId(newGroupStudyModeId); // Set the room ID in the global context
    shareableLink.current = `${window.location.origin}/room/${newGroupStudyModeId}?mode=GSMode`;
    // connectToRoom(() => {
    if (loggedIn) {
      copyLinkToClipboard();
      navigate(`/room/${newGroupStudyModeId}?mode=GSMode`);
    }
    // });
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard
      .writeText(shareableLink.current)
      .then(() => {
        toast.success("Link copied to clipboard!", {
          position: "top-right",
          autoClose: 5000,
          theme: "dark",
        });
      })
      .catch((error) => {
        toast.error("Unable to copy to clipboard", {
          position: "top-right",
          autoClose: 5000,
          theme: "dark",
        });
      });
  };

  return (
    <div className="flex-1 max-w-md bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl flex flex-col items-center p-8 hover:border-indigo-500/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300">
      <LoginToContinue />
      <h2 className="text-2xl font-bold mb-4 text-slate-100 text-center">Group Study Mode</h2>
      <div className="w-full flex justify-center mb-6">
        <img
          src="/student.png"
          alt="group study mode"
          className="rounded-lg object-contain hover:scale-105 transition-transform duration-300"
          onClick={copyLinkToClipboard}
          style={{ cursor: "pointer", width: "240px", height: "160px" }}
        />
      </div>
      <p className="my-4 text-slate-400 text-sm leading-relaxed text-justify flex-grow">
        In Group Study Mode, students can create a room for their collaborative
        study sessions. Within these sessions, students have the ability to view
        the codes of their peers. This exchange of perspectives and approaches
        promotes deeper understanding and cultivates a supportive learning
        community. Students are unable to edit the code of other students in the room.
      </p>
      <button
        onClick={handleCreateRoom}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-md hover:shadow-indigo-500/20 hover:scale-[1.02] transition-all duration-200"
      >
        Create Room
      </button>
    </div>
  );
};

export default GroupStudyModeCard;
