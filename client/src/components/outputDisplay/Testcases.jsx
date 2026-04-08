import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import ProblemContext from "../../context/ProblemContext";


const Testcases = () => {
  const { problemId } = useParams();
  const { allProblems } = useContext(ProblemContext);

  const problem = allProblems?.find(
    (p) => Number(p.id) === Number(problemId)
  );
console.log("Problems:", allProblems);
  if (!problem) {
    return <div>Loading test cases...</div>;
  }

  return (
    <div className="whitespace-pre-line">
      <pre>{problem.runInput}</pre>
    </div>
  );
};

export default Testcases;