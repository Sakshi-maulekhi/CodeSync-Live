import React, { useContext, useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import YouTubeIcon from "@mui/icons-material/YouTube";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ProblemContext from "../../context/ProblemContext";
import { Link, useLocation } from "react-router-dom";
import GlobalContext from "../../context/GlobalContext";
import { serverUrl } from "../../constants";
import ShowChartIcon from "@mui/icons-material/ShowChart";

function ProblemList() {
  const {
    filteredProblems,
    statusList,
    setStatusList,
    attemptedList,
    setAttemptedList,
  } = useContext(ProblemContext);
  const { socket, roomId } = useContext(GlobalContext);
  const [singleMode, setSingleMode] = useState(true);
  const location = useLocation();
  const roomUrl = useRef("");

  const { loggedIn, username } = useContext(GlobalContext);
  useEffect(() => {
    if (location.pathname.includes("room")) {
      // roomUrl.current = `${location.
      roomUrl.current = `${location.search}`;
      setSingleMode(false);
    }
  }, [location]);

  const getProblemLink = (problemId) => {
    const params = new URLSearchParams(location.search);
    const baseUrl = `${location.pathname}`;

    return `${baseUrl}/problems/${problemId}?${params.toString()}`;
  };

  useEffect(() => {
    let isMounted = true; // To handle component unmount

    // Do not fetch until we actually have the logged in username
    if (!loggedIn || !username || typeof username !== 'string' || !username.trim() || username === "undefined" || username === "null") return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${serverUrl}/api/users/profile/${username}`
        );
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        const data = await response.json();

        if (isMounted) {
          const solvedProblems = data?.problemsSolved || [];
          const newStatus = [];
          const newAttempted = [];

          solvedProblems.forEach((problem) => {
            if (problem.totalTestCases > 0 && problem.totalTestCases === problem.testCasesPassed) {
              newStatus.push(problem.problem?.id ?? problem.problemId);
            } else {
              newAttempted.push(problem.problem?.id ?? problem.problemId);
            }
          });

          // Use Sets so we don't infinitely duplicate IDs if the effect runs multiple times
          setStatusList(newStatus);
setAttemptedList(newAttempted);
        }
      } catch (error) {
        if (isMounted) {
          console.error("There was a problem with the fetch operation:", error);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup function to avoid setting state on unmounted component
    };
  }, [loggedIn, username, serverUrl, setStatusList, setAttemptedList]);
  console.log(statusList, attemptedList);
  return (
    <>
      <div className="overflow-hidden border border-slate-800/80 rounded-xl bg-slate-950/20 backdrop-blur-sm shadow-xl">
        <table className="min-w-full divide-y divide-slate-850">
          <thead className="bg-slate-900/60 backdrop-blur-md">
            <tr>
              <th
                scope="col"
                className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4 text-left"
              >
                Status
              </th>
              <th
                scope="col"
                className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4 text-left"
              >
                Title
              </th>

              <th
                scope="col"
                className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4 text-left"
              >
                Solution
              </th>
              <th
                scope="col"
                className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4 text-left"
              >
                Difficulty
              </th>
              <th
                scope="col"
                className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4 text-left"
              >
                Tags
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/50 bg-slate-950/10">
            {filteredProblems.map((problem, index) => (
              <tr
                key={uuidv4()}
                className="hover:bg-indigo-600/5 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {attemptedList.includes(problem.id) ? (
                    <ShowChartIcon className="mr-2 text-rose-500 border rounded-full border-rose-500/30 p-[1px]" />
                  ) : (
                    <CheckCircleOutlineIcon
                      style={{
                        color: statusList.includes(problem.id)
                          ? "#10b981"
                          : "#475569",
                      }}
                    />
                  )}
                </td>
                <td className="text-sm font-medium px-6 py-4 whitespace-nowrap">
                  <Link
                    relative="path"
                    to={
                      singleMode
                        ? `/problems/${problem.id}`
                        : getProblemLink(problem.id)
                    }
                    onClick={() => {
                      if (socket && roomId) {
                        socket.emit("selectedQuestion", {
                          room: roomId,
                          questionId: problem.id,
                        });
                      }
                    }}
                    className="text-slate-200 hover:text-blue-400 transition-colors duration-150"
                  >
                    {problem.id + ". " + problem.title}
                  </Link>
                </td>

                <td className="text-sm px-6 py-4 whitespace-nowrap">
                  <a
                    href={problem.video}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-slate-400 hover:text-rose-500 hover:scale-110 transition-all duration-150"
                  >
                    <YouTubeIcon />
                  </a>
                </td>
                <td className="text-sm px-6 py-4 whitespace-nowrap">
                  {problem.difficulty === "Easy" ? (
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide">
                      Easy
                    </span>
                  ) : problem.difficulty === "Medium" ? (
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide">
                      Medium
                    </span>
                  ) : (
                    <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide">
                      Hard
                    </span>
                  )}
                </td>
                <td className="text-sm text-white px-6 py-4 whitespace-nowrap">
                  {problem.tags.map((tag) => (
                    <span
                      key={uuidv4()}
                      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 mr-2 hover:border-slate-700 transition-colors duration-150"
                    >
                      {tag}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ProblemList;
