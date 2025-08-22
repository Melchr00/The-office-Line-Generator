import { useState } from "react";
import { motion, AnimatePresence, useAnimation} from "framer-motion";
import { QuoteDisplay } from "./QuoteDisplay";
import { LoadingSpinner } from "./LoadingSpinner";
import { GradientBorder } from "./GradientBorder";
import { color_palettes, stringToColors } from "../utils/colorPalettes";


const API_URL = import.meta.env.VITE_API_URL;

const LineGenerator = () => {
    const [quote, setQuote] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);


    const buttonControls = useAnimation();
    const audioPath = "/drop_003.ogg";

    const fetchRandomLine = async () => {
        setError(null);
        setLoading(true);

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
    }

    const handleClick = async () => {
        await new Audio(audioPath).play();
        fetchRandomLine();
        await buttonControls.start({ scale: 0.8, transition: { duration: 0.2 } })
        await buttonControls.start({ scale: 1, transition: { duration: 0.2 } })
    }

    const baseHue = quote ? color_palettes[quote.character]?.[0] : null;
    const colors = quote ? stringToColors(quote.character, 5, baseHue) : null;
    const gradient = colors ? `conic-gradient(${colors.join(", ")})` : "conic-gradient(#000, #333)";

    const getScaleForQuote = (q) => {
        if (!q?.line) return 1;
        const len = q.line.length;
        if (len > 120) return 0.85;
        if (len > 80) return 0.9;
        if (len > 40) return 0.95;
        return 1;
    }
    const scale = getScaleForQuote(quote);

    return (
        <main className="relative h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6 overflow-hidden">
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