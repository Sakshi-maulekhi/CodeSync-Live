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
      <div className="overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray border-b">
            <tr>
              <th
                scope="col"
                className="text-sm font-medium text-white px-6 py-4 text-left"
              >
                Status
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-white px-6 py-4 text-left"
              >
                Title
              </th>

              <th
                scope="col"
                className="text-sm font-medium text-white px-6 py-4 text-left"
              >
                Solution
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-white px-6 py-4 text-left"
              >
                Difficulty
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-white px-6 py-4 text-left"
              >
                Tags
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredProblems.map((problem, index) => (
              <tr
                key={uuidv4()}
                className={`border-b hover:text-green hover:bg-gray-800 ${index % 2 === 0 ? "bg-black" : "bg-neutral-800"
                  }  `}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  {/* {problem.status} */}
                  {attemptedList.includes(problem.id) ? (
                    <ShowChartIcon className="mr-2 text-red-500 border rounded-full border-red-500 p-[1px]" />
                  ) : (
                    <CheckCircleOutlineIcon
                      style={{
                        color: statusList.includes(problem.id)
                          ? "green"
                          : "inherit",
                      }}
                    />
                  )}
                </td>
                <td className="text-sm text-white font-light px-6 py-4 whitespace-nowrap">
                  <Link
                    relative="path"
                    to={
                      singleMode
                        ? `/problems/${problem.id}`
                        : // : `problems/ ${problem.id}`
                        getProblemLink(problem.id)
                    }
                    onClick={() => {
                      if (socket && roomId) {
                        socket.emit("selectedQuestion", {
                          room: roomId,
                          questionId: problem.id,
                        });
                      }
                    }}
                    className="hover:text-blue-600"
                  >
                    {problem.id + ". " + problem.title}
                  </Link>
                </td>

                <td className="text-sm text-white font-light px-6 py-4 whitespace-nowrap">
                  <a href={problem.video} target="_blank" rel="noreferrer">
                    {" "}
                    {/* {problem.solution} */}
                    <YouTubeIcon className="hover:text-red-500" />
                  </a>
                </td>
                <td
                  className={`text-sm font-light px-6 py-4 whitespace-nowrap ${problem.difficulty === "Easy"
                    ? "text-green-500"
                    : problem.difficulty === "Medium"
                      ? "text-yellow-500"
                      : "text-red-500"
                    }`}
                >
                  {problem.difficulty}
                </td>
                <td className="text-sm text-white font-light px-6 py-4 whitespace-nowrap">
                  {problem.tags.map((tag) => (
                    <span
                      key={uuidv4()}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-white mr-2"
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
