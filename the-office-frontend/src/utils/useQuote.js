import { useState, useCallback } from "react";
import { getRolesFromToken } from "./auth";


export const useQuote = (API_URL, user, loginEnabled) => {
    const [quote, setQuote] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchRandomLine = useCallback(async () => {
        setError(null);
        setLoading(true);


        if (loginEnabled) {
            const roles = getRolesFromToken(user?.access_token);
            if (!roles.includes("paid")) {
                setError("You must have a 'paid' subscription to access this feature.")
                setLoading(false);
                setQuote(null);
                return;
            }
        }


        try {
            const res = await fetch(`${API_URL}/random`, {})

            if (!res.ok) throw new Error("Network response was not ok");
            const data = await res.json();
            setQuote(data);
        } catch (err) {
            setError("Could not fetch a quote. Please try again.")
            setQuote(null);
        } finally {
            setLoading(false);
        }
    }, [API_URL, user, loginEnabled]);
    return { quote, loading, error, fetchRandomLine };
}





