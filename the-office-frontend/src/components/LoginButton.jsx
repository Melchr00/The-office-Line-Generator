/*** Basic login button component.
 * Redirects the user to the provided login URL. ***/

export const LoginButton = ({ loginUrl }) => {
    return (
        <button
            onClick={() => window.location.href = loginUrl}
            className="px-4 py-2 bg-blue-600 text-white rounded"
        >
            Log In
        </button>
    )
}