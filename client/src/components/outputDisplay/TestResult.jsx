import React, { useContext } from "react";
import CodeEditorContext from "../../context/CodeEditorContext";
import { useParams } from "react-router-dom";
import ProblemContext from "../../context/ProblemContext";

const TestResult = () => {
  const { output, runResponse } = useContext(CodeEditorContext);
  const { allProblems } = useContext(ProblemContext);
  const { problemId } = useParams();

  const problem = allProblems?.find(
    (p) => Number(p.id) === Number(problemId)
  );

  // When we get a runResult back from the server we show a simple
  // LeetCode‑style verdict for the first test case.  Otherwise fall back to
  // the old behaviour that just printed the raw expected / your output.
  return (
    <div className="whitespace-pre-line">
      {runResponse ? (
        <div>Running...</div>
      ) : output?.runResult ? (
        // we have an evaluated result
        output.runResult.status === "Accepted" ? (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
            <div className="font-bold text-lg mb-2">✓ Accepted</div>
            <div className="text-sm">First test case passed</div>
          </div>
        ) : (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <div className="font-bold text-lg mb-3">✗ Wrong Answer</div>
            <div className="bg-red-50 p-3 rounded mb-3 text-xs font-mono">
              <div className="font-bold text-red-800 mb-1">Input:</div>
              <div className="text-red-600 whitespace-pre-wrap break-words">
                {output.runResult.failedTestCase?.input}
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded mb-3 text-xs font-mono">
              <div className="font-bold text-green-800 mb-1">Expected Output:</div>
              <div className="text-green-600 whitespace-pre-wrap break-words">
                {output.runResult.failedTestCase?.expected}
              </div>
            </div>
            <div className="bg-gray-100 p-3 rounded text-xs font-mono">
              <div className="font-bold text-gray-800 mb-1">Your Output:</div>
              <div className="text-gray-600 whitespace-pre-wrap break-words">
                {output.runResult.failedTestCase?.output}
              </div>
            </div>
          </div>
        )
      ) : output?.output !== undefined ? (
        <>
          <b>EXPECTED OUTPUT</b>
          <br />
          <pre>{problem?.runOutput}</pre>

          <br />

          <b>YOUR OUTPUT</b>
          <pre>{output.output}</pre>
        </>
      ) : (
        <div>No Test Run Yet</div>
      )}
    </div>
  );
};

export default TestResult;