import { useContext, useEffect } from "react";
import GlobalContext from "../../context/GlobalContext";
import { API_URL } from "../../constants";
import { set } from "react-hook-form";
// import {db} from '../../firebase';
// import {collection,getDocs} from 'firebase/firestore';

function useProblems() {
  const { setProblems, setProblemLoading } = useContext(GlobalContext);
  useEffect(() => {
    // console.log("useProblems useEffect called, getting problems from backend");
    try {
      setProblemLoading(true);
      fetch(API_URL + "/api/problems").then((response) => {
        response.json().then((data) => {
          if (Array.isArray(data)) {
            setProblems(data);
          } else {
            console.error("Backend sent an error object, fallback to empty array:", data);
            setProblems([]);
          }
        }).catch(err => {
          console.error("Failed parsing JSON from /api/problems:", err);
          setProblems([]);
        });
        setProblemLoading(false);
      }).catch(err => {
        console.error("Network fetch failed:", err);
        setProblems([]);
        setProblemLoading(false);
      });
    } catch (e) {
      console.error("Error in fetching problems from backend", e);
      setProblems([]);
      setProblemLoading(false);
    }
  }, []);
}

export default useProblems;
