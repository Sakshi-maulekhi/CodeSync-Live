import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../constants";

function useUserDetails(username) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      if (!username || typeof username !== 'string' || !username.trim() || username === "undefined" || username === "null") {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data } = await axios.get(
          `${serverUrl}/api/users/profile/${username.trim()}`
        );
        if (isMounted) {
          setUser(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('[useUserDetails] fetch error:', err?.response?.data || err.message);
        if (isMounted) setLoading(false);
      }
    };
    fetchUser();

    // Listen for profile updates (dispatched after submissions)
    const handler = (ev) => {
      try {
        const updated = ev.detail;
        if (updated && updated.name === username) {
          // apply the object immediately (new reference) so consuming components re-render
          setUser((prev) => ({ ...updated }));
          // and still refetch to make sure we have the most up-to-date copy from DB
          fetchUser();
        }
      } catch (e) {
        console.error('[useUserDetails] profile update handler error', e);
      }
    };

    window.addEventListener('userProfileUpdated', handler);

    return () => {
      isMounted = false;
      window.removeEventListener('userProfileUpdated', handler);
    };
  }, [username]);

  return { user, loading };
}

export default useUserDetails;
