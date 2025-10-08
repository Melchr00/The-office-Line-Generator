import { useState, useCallback } from "react";

export const getUserInfo = (userName, ADMIN_API_URL) => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUserInfo = useCallback(async () => {
        if (!userName) return;
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${ADMIN_API_URL}/api/admin/users/${userName}/info`);
            if (!res.ok) throw new Error("Network response was not ok");

            const data = await res.json();
            setUserInfo(data);
        } catch (err) {
            setError("Could not fetch user info. Please try again.");
            setUserInfo(null);
        } finally {
            setLoading(false);
        }
    }, [ADMIN_API_URL, userName]);

    return { userInfo, loading, error, fetchUserInfo };
};
