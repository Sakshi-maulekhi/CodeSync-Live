import React, { useContext, useEffect } from "react";
import { useRef } from "react";
import Editor from "@monaco-editor/react";
import CodeEditorContext from "../../context/CodeEditorContext";
import CodeEditorTop from "./CodeEditorTop";
import GlobalContext from "../../context/GlobalContext";
import { CPP_DEFAUTL_CODE, C_DEFAUTL_CODE, PYTHON_DEFAUTL_CODE, JAVA_DEFAUTL_CODE } from "../../constants";
// import SubmitReport from "./sub-components/SubmitReport";

const CodeEditor = ({ socket, displayName, roomId, friendText }) => {
    const { theme, language } = useContext(CodeEditorContext);
    const { editorRef } = useContext(CodeEditorContext);
    const { username } = useContext(GlobalContext);

    
    const getDefaultCode = () => {
        switch (language) {
            case 'cpp':
                return CPP_DEFAUTL_CODE;
            case 'c':
                return C_DEFAUTL_CODE;
            case 'python':
                return PYTHON_DEFAUTL_CODE;
            case 'java':
                return JAVA_DEFAUTL_CODE;
            default:
                return CPP_DEFAUTL_CODE;
        }
    };

    const defaultCode = getDefaultCode();

    // const editorRef = useRef(null);

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
    }

    useEffect(() => {
        if (socket == null) return;

        socket.emit("sendMessageToRoom", {
            room: roomId,
            message: CPP_DEFAUTL_CODE,
            from: username,
            to: username,
        });
    }, []);

    return (
        <div className="bg-gray-900 text-white">
            <CodeEditorTop
                socket={socket}
                roomId={roomId}
                displayName={displayName}
            />
            <div className="bg-gray-900 h-[600edpx]">
                {/* <SubmitReport
          accepted={accepted}
          showAccepted={showAccepted}
          setShowAccepted={setShowAccepted}
        /> */}
                <Editor
                    height="44vh"
                    defaultLanguage={language}
                    defaultValue={defaultCode}
                    options={{
                        wordWrap: "on",
                    }}
                    onMount={handleEditorDidMount}
                    onChange={(value, event) => {
                        if (socket == null) return;

                        socket.emit("sendMessageToRoom", {   
                            room: roomId,
                            message: value,
                            from: username,
                            to: username,
                        });  
                    }}
                    theme={`vs-${theme}`}
                    sx={{
                        borderBottomLeftRadius: "8px",
                    }}
                />
                {/* <RunSubmit editorRef={editorRef} /> */}
            </div>
        </div>
    );
};

export default CodeEditor;
