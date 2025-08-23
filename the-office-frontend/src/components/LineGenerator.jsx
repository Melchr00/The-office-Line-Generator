/*** Main component. Handles authentication, quote fetching, animations, and UI layout. ***/

import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { QuoteDisplay } from "./QuoteDisplay";
import { LoadingSpinner } from "./LoadingSpinner";
import { GradientBorder } from "./GradientBorder";
import { useAuth } from "react-oidc-context";
import ToggleSwitch from "./ToggleSwitch";
import { useQuote } from "../utils/useQuote";
import { getGradientForQuote } from "../utils/gradients";
import { getScaleForQuote } from "../utils/quoteScaling";
import { useState } from "react";


const API_URL = import.meta.env.VITE_API_URL;

const LineGenerator = () => {
    // Toggle login requirement, persisted in localStorage
    const [allowLogin, setAllowLogin] = useState(() => {
        const saved = localStorage.getItem("loginToggle");
        return saved ? JSON.parse(saved) : false
    })
    const { isAuthenticated, user, isLoading, signinRedirect, signoutRedirect } = useAuth();
    const { quote, loading, error, fetchRandomLine } = useQuote(API_URL, user, allowLogin);

    const buttonControls = useAnimation();
    const audioPath = "/drop_003.ogg";

    /**
   * Handle login/logout depending on current auth state.
   */
    const handleLoginLogout = () => {
        if (isAuthenticated) {
            signoutRedirect();
        } else {
            signinRedirect();
        }
    }

    /**
        * Play a sound, fetch a new quote, and animate the button press.
        */
    const handleClick = async () => {
        await new Audio(audioPath).play();
        fetchRandomLine();
        await buttonControls.start({ scale: 0.8, transition: { duration: 0.2 } })
        await buttonControls.start({ scale: 1, transition: { duration: 0.2 } })
    }

    const gradient = getGradientForQuote(quote);
    const scale = getScaleForQuote(quote);

    return (
        <main className="relative h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6 overflow-hidden">
            {/* Toggle for enabling login (persisted in localStorage) */}
            <div className="absolute top-4 left-4">
                <ToggleSwitch
                    onToggle={(state) => {
                        setAllowLogin(state);
                        localStorage.setItem("loginToggle", state)
                    }}
                    label="Enable Login"
                    disabled={false}
                    forceOn={isAuthenticated}
                    initial={allowLogin}
                />
            </div>
            {/* Login/logout button */}
            <div className="absolute top-4 right-4">
                <button
                    onClick={handleLoginLogout}
                    disabled={isLoading || (!allowLogin && !isAuthenticated)}
                    className={`px-4 py-2 rounded-lg text-white font-semibold transition-colors ${isAuthenticated ? "bg-red-600 hover:bg-red-700"
                        : allowLogin ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
                >
                    {isLoading ? "..." : isAuthenticated ? "Logout" : "Login"}
                </button>
            </div>
            {/* Quote display wrapped with animated gradient-border */}
            <GradientBorder gradient={gradient}>
                <motion.section
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="max-w-sm sm:max-w-md md:max-w-lg rounded-xl shadow-lg p-6 sm:p-8 text-center"
                    tabIndex={-1}>


                    <header>
                        <motion.h1
                            layout
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6"
                        >
                            The Office Line Generator
                        </motion.h1>
                    </header>
                    {error && <motion.p className="text-red-700 mb-4" role="alert">{error}</motion.p>}

                    <motion.div className="mb-6 min-h-[6rem] flex items-center justify-center">
                        <AnimatePresence mode="wait" initial={false}>
                            {loading ? <LoadingSpinner /> : <QuoteDisplay quote={quote} />}
                        </AnimatePresence>
                    </motion.div>
                    {/* Generate Quote button */}
                    <motion.button
                        layout
                        animate={buttonControls}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.75 }}
                        onClick={handleClick}
                        disabled={loading}
                        className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50">
                        {loading ? "Loading..." : "Generate Quote"}
                    </motion.button>
                </motion.section>
            </GradientBorder>
        </main>
    )
}
export default LineGenerator;