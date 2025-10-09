import { useEffect } from "react";
import { getUserInfo } from "../utils/getUserInfo"; 

export const Account = () => {
  // Get userName from localStorage
  const userName = localStorage.getItem("userName");
   
  const ADMIN_API_URL = import.meta.env.VITE_ADMIN_API_URL;

  // Use custom hook to fetch user info
  const { userInfo, loading, error, fetchUserInfo } = getUserInfo(userName, ADMIN_API_URL);

  // Fetch user info when the component mounts
  useEffect(() => {
    fetchUserInfo(); //initial load
  // ✅ Listen for backend WebSocket events
    const ws = new WebSocket("ws://localhost:4002");

    ws.onopen = () => console.log("Connected to WS for role updates");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "roleUpdate" && data.username === userName) {
        console.log("Role update detected — refreshing account info");
        fetchUserInfo();
      }
    };
    ws.onclose = () => console.log("WebSocket closed");

    return () => ws.close();
  }, [userName, fetchUserInfo]);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
      <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Account Info
      </h1>

      {loading && <p className="text-gray-500">Loading user info...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {userInfo && (
        <>
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">User Details</h2>
            <div className="space-y-1 text-gray-700 dark:text-gray-300">
              <p><strong>ID:</strong> {userInfo.user.id}</p>
              <p><strong>Username:</strong> {userInfo.user.username}</p>
              <p><strong>Name:</strong> {userInfo.user.firstName} {userInfo.user.lastName}</p>
              <p><strong>Email:</strong> {userInfo.user.email}</p>
              <p><strong>Email Verified:</strong> {userInfo.user.emailVerified ? " Yes" : "No"}</p>
              <p><strong>Enabled:</strong> {userInfo.user.enabled ? "Yes" : "No"}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">Subscription</h2>
            {userInfo.subscriptionRoles.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                {userInfo.subscriptionRoles.map(role => (
                  <li key={role.id}>
                    {role.name.replace("tier_", "").toUpperCase()}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No subscription roles assigned.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Account;
