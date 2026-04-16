import React, { useContext, useEffect } from "react";
import CodeEditorContext from "../../context/CodeEditorContext";
import ProblemContext from "../../context/ProblemContext";
import GlobalContext from "../../context/GlobalContext";
import axios from "axios";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useParams } from "react-router-dom";
import {
  serverUrl,
  CPP_DEFAUTL_CODE,
  C_DEFAUTL_CODE,
  PYTHON_DEFAUTL_CODE,
  JAVA_DEFAUTL_CODE,
} from "../../constants";

const RunSubmit = () => {
  const {
    setRunResponse,
    setSubmitResponse,
    setSubmitOutput,
    setSubmitResult,
    setOutput,
    setActiveComponent,
    editorRef,
    language,
  } = useContext(CodeEditorContext);

  const { allProblems } = useContext(ProblemContext);
  const { username } = useContext(GlobalContext);
  const { problemId } = useParams();

  const problem = allProblems?.find(
    (p) => Number(p.id) === Number(problemId)
  );

  const api_input_run = problem?.runInput;
  const api_input_submit = problem?.submitInput;

  // =========================
  // RESTORE SAVED DRAFT
  // =========================
  useEffect(() => {
  if (!editorRef.current || !username || !problemId) return;

  const key = `code-${username}-${problemId}`;
  const editor = editorRef.current;

  // 1️⃣ Restore saved code once
  const savedCode = localStorage.getItem(key);

  if (savedCode) {
    editor.setValue(savedCode);
  } else {
    if (language === "cpp") {
      editor.setValue(CPP_DEFAUTL_CODE);
    } else if (language === "python") {
      editor.setValue(PYTHON_DEFAUTL_CODE);
    } else if (language === "c") {
      editor.setValue(C_DEFAUTL_CODE);
      } else if (language === "java") {
        editor.setValue(JAVA_DEFAUTL_CODE);
      }
      }
  const disposable = editor.onDidChangeModelContent(() => {
    const currentCode = editor.getValue();
    localStorage.setItem(key, currentCode);
  });

  return () => {
    disposable.dispose();
  };
}, [editorRef, username, problemId, language]);
  async function runCode() {
    setActiveComponent("test result");
    setRunResponse(true);

    try {
      await makePostRequest(
        editorRef.current.getValue(),
        api_input_run,
        language,
        "run"
      );
    } finally {
      setRunResponse(false);
    }
  }

  async function submitCode() {
    setActiveComponent("submit result");
    setSubmitResponse(true);

    try {
      await makePostRequest(
        editorRef.current.getValue(),
        api_input_submit,
        language,
        "submit"
      );
    } finally {
      setSubmitResponse(false);
    }
  }

  const makePostRequest = async (code, inp, language, reqType) => {
    try {
      if (!problem) {
        console.warn("Problem not loaded yet");
        return;
      }
      if (!username) {
        console.warn("Username missing");
        return;
      }
      if (!code || !code.trim()) {
        console.warn("Code is empty");
        return;
      }

      const payload = {
        code,
        input: typeof inp === "string" ? inp : String(inp ?? ""),
        language,
        reqType,
        problem,
        username,
      };

      const response = await axios.post(
        `${serverUrl}/api/code/run-submit`,
        payload
      );

      if (reqType === "run") {
        setOutput({ ...response.data });
      }

      if (reqType === "submit") {
        setSubmitOutput({ ...response.data });
        
        // Store the new submitResult structure for LeetCode-style display
        if (response.data?.submitResult) {
          setSubmitResult({ ...response.data.submitResult });
        }

        if (response.data?.updatedUser) {
          window.dispatchEvent(
            new CustomEvent("userProfileUpdated", {
              detail: { ...response.data.updatedUser },
            })
          );
        }
      }
    } catch (error) {
      console.error("Submit error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }
  };

  return (
    <div className="pt-1 flex justify-end">
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 rounded mr-5 h-8"
        onClick={runCode}
      >
        Run <PlayArrowIcon />
      </button>

      <button
        className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 mr-3 rounded h-8"
        onClick={submitCode}
      >
        Submit
      </button>
    </div>
  );
};

export default RunSubmit;