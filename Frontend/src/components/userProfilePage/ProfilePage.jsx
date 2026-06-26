import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Heatmap from "./Heatmap";
import ApexChart from "./questionProgress/PieChart";
import CircularProgress from "./questionProgress/CircularProgress";
import DifficultyProgressBar from "./questionProgress/DifficultyProgressBar";
import GlobalContext from "../../context/GlobalContext";
import useUserDetails from "../hooks/useUserDetails";
import EditProfileModal from "./EditProfileModal";
import ProblemContext from "../../context/ProblemContext";
import axios from "axios";
import { serverUrl } from "../../constants";

const ProfilePage = () => {
  const { username } = useParams();
  const { user, loading } = useUserDetails(username);
  const { problems } = useContext(GlobalContext);
  const { statusList, attemptedList, setAttemptedList, setStatusList } =
    useContext(ProblemContext);
  const [topics, setTopics] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  useEffect(() => {
    const topicSet = new Map();
    const topicTemp = user?.problemsSolved
      ?.filter((problem) => problem.isSolved === true)
      ?.map((problem) => problem.problem.tags);
    topicTemp?.forEach((topic) => {
      topic?.forEach((tag) => {
        if (topicSet.has(tag)) {
          topicSet.set(tag, topicSet.get(tag) + 1);
        } else {
          topicSet.set(tag, 1);
        }
      });
    });
    setTopics(Array.from(topicSet).map(([name, count]) => ({ name, count })));

    const languageSet = new Map();
    const languageTemp = user?.problemsSolved
      ?.filter((problem) => problem.isSolved === true)
      .map((problem) => problem.language);
    languageTemp?.forEach((language) => {
      if (languageSet.has(language)) {
        languageSet.set(language, languageSet.get(language) + 1);
      } else {
        languageSet.set(language, 1);
      }
    });
    setLanguages(
      Array.from(languageSet).map(([name, count]) => ({ name, count }))
    );

    setStatusList([]);
    setAttemptedList([]);
    const solvedProblems = user?.problemsSolved;
    solvedProblems?.forEach((problem) => {
      if (problem.isSolved === true) {
        setStatusList((prev) => [...prev, Number(problem.problem.id)]);
      } else {
        setAttemptedList((prev) => [...prev, Number(problem.problem.id)]);
      }
    });
  }, [user, setAttemptedList, setStatusList]);

  const easySolved = user?.problemsSolved?.filter(
    (problem) =>
      problem.problem.difficulty === "Easy" && problem.isSolved === true
  ).length;
  const mediumSolved = user?.problemsSolved?.filter(
    (problem) =>
      problem.problem.difficulty === "Medium" && problem.isSolved === true
  ).length;
  const hardSolved = user?.problemsSolved?.filter(
    (problem) =>
      problem.problem.difficulty === "Hard" && problem.isSolved === true
  ).length;
  const codeScore = easySolved * 1 + mediumSolved * 3 + hardSolved * 5;
  const easyTotal = problems.filter((problem) => problem.difficulty === "Easy").length;
  const mediumTotal = problems.filter((problem) => problem.difficulty === "Medium").length;
  const hardTotal = problems.filter((problem) => problem.difficulty === "Hard").length;
  const questionsTrack = {
    totalQuestions: {
      total: problems.length,
      solved: easySolved + mediumSolved + hardSolved,
    },
    easy: { total: easyTotal, solved: easySolved },
    medium: { total: mediumTotal, solved: mediumSolved },
    hard: { total: hardTotal, solved: hardSolved },
  };
  const calculatePercentage = (count, total) => {
    return (count / total) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
        Loading profile...
      </div>
    );
  }

  function toDate(submittedOn) {
    if (!submittedOn) return "";

    const date = new Date(submittedOn);
    const now = new Date();
    const diffInMillis = now - date;
    const diffInSeconds = Math.floor(diffInMillis / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }
  }

  const handleSubmit = async (formData) => {
    const { role, location, about, profilePhoto } = formData;
    const res = await axios.put(
      `${serverUrl}/api/users/profile/${localStorage.getItem("username")}`,
      {
        role,
        location,
        about,
        profilePhoto,
      }
    );

    window.dispatchEvent(
      new CustomEvent("userProfileUpdated", {
        detail: res.data,
      })
    );

    closeModal();
  };

  return (
    <>
      <EditProfileModal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        onSubmit={handleSubmit}
      />
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.2),_transparent_28%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] py-10 text-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 rounded-3xl border border-slate-800/80 bg-slate-950/60 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.35em] text-blue-400">
                  Profile overview
                </p>
                <h1 className="text-3xl font-bold text-white sm:text-4xl">
                  {user?.name || username}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  {user?.userDescription || "Keep sharpening your problem-solving craft and track your growth here."}
                </p>
              </div>
              <button
                onClick={openModal}
                className="inline-flex items-center justify-center rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-blue-500/30"
              >
                <i className="fa-solid fa-pen mr-2" />
                Edit Profile
              </button>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[320px,1fr]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur-xl">
                <div className="flex flex-col items-center text-center">
                  <img
                    className="h-28 w-28 rounded-full border-4 border-slate-700 object-cover shadow-lg shadow-slate-950/60"
                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${localStorage.getItem("username")}`}
                    alt="profile"
                  />
                  <h2 className="mt-4 text-2xl font-semibold text-white">
                    {user?.name}
                  </h2>
                  <p className="mt-2 text-sm font-medium text-blue-400">
                    {user?.designation || "Aspiring problem solver"}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {user?.userDescription || "A calm, consistent coder building momentum one problem at a time."}
                  </p>
                </div>

                <div className="mt-6 space-y-3 text-sm text-slate-300">
                  <div className="flex items-center rounded-2xl border border-slate-800/80 bg-slate-900/70 px-3 py-3">
                    <i className="fa-solid fa-user-group mr-3 text-blue-400" />
                    <span>{user?.location || "Undisclosed location"}</span>
                  </div>
                  <div className="flex items-center rounded-2xl border border-slate-800/80 bg-slate-900/70 px-3 py-3">
                    <i className="fa-solid fa-envelope mr-3 text-blue-400" />
                    <span>{user?.email || "No email available"}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-3">
                  <span className="rounded-full bg-emerald-500/10 p-2 text-emerald-400">
                    <i className="fa-solid fa-list-check" />
                  </span>
                  <h3 className="text-lg font-semibold text-white">Topics</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {topics.length > 0 ? (
                    topics.map((topic, index) => (
                      <span
                        key={index}
                        className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-sm text-slate-300"
                      >
                        {topic.name} <span className="ml-1 text-emerald-400">x{topic.count}</span>
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">No topics tracked yet.</p>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-3">
                  <span className="rounded-full bg-violet-500/10 p-2 text-violet-400">
                    <i className="fa-solid fa-code" />
                  </span>
                  <h3 className="text-lg font-semibold text-white">Languages</h3>
                </div>
                <div className="space-y-2">
                  {languages.length > 0 ? (
                    languages.map((language, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-300"
                      >
                        <span>{language.name}</span>
                        <span className="text-slate-400">{language.count} solved</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">No language data yet.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur-xl">
                <div className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
                  <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex-shrink-0">
                        <CircularProgress
                          calculatePercentage={calculatePercentage}
                          solved={questionsTrack.totalQuestions.solved}
                          total={questionsTrack.totalQuestions.total}
                        />
                      </div>
                      <div className="space-y-3">
                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
                          Coding Score: {codeScore}
                        </div>
                        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 px-3 py-2 text-sm text-slate-300">
                          <div className="text-emerald-400">Accepted: {statusList.length}</div>
                          <div className="mt-1 text-rose-400">Wrong: {attemptedList.length}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-4">
                    <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                      <i className="fa-solid fa-chart-pie text-blue-400" />
                      Difficulty split
                    </div>
                    <div className="flex items-center gap-4">
                      <ApexChart
                        easy={questionsTrack.easy.solved}
                        medium={questionsTrack.medium.solved}
                        hard={questionsTrack.hard.solved}
                      />
                      <div className="flex-1">
                        <DifficultyProgressBar
                          questionsTrack={questionsTrack}
                          calculatePercentage={calculatePercentage}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Activity heatmap</h3>
                    <p className="text-sm text-slate-400">Your consistency is showing.</p>
                  </div>
                </div>
                <Heatmap heatmapData={user?.heatmapData} />
              </div>

              <div className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Recent submissions</h3>
                    <p className="text-sm text-slate-400">Latest problems you engaged with.</p>
                  </div>
                </div>
                <div className="overflow-hidden rounded-2xl border border-slate-800/70">
                  <table className="min-w-full divide-y divide-slate-800/80 text-sm text-slate-300">
                    <thead className="bg-slate-900/80 text-xs uppercase tracking-[0.25em] text-slate-400">
                      <tr>
                        <th className="px-4 py-3 text-left">Problem</th>
                        <th className="px-4 py-3 text-left">Difficulty</th>
                        <th className="px-4 py-3 text-left">Submitted on</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70 bg-slate-950/60">
                      {user?.problemsSolved?.length ? (
                        [...(user?.problemsSolved || [])]
                          .sort((a, b) => (b?.submittedOn?._seconds || 0) - (a?.submittedOn?._seconds || 0))
                          .map(({ problem, submittedOn }, index) => (
                            <tr key={index} className="transition-colors duration-150 hover:bg-slate-900/70">
                              <td className="px-4 py-3">
                                <Link
                                  to={`/problems/${problem.id}`}
                                  className="font-medium text-slate-100 transition-colors hover:text-blue-400"
                                >
                                  {problem.title}
                                </Link>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                                    problem.difficulty === "Easy"
                                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                                      : problem.difficulty === "Medium"
                                      ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                                      : "border-rose-500/20 bg-rose-500/10 text-rose-400"
                                  }`}
                                >
                                  {problem.difficulty}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-slate-400">{toDate(submittedOn)}</td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="px-4 py-6 text-center text-slate-400">
                            No submission history yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
