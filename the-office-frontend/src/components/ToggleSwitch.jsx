/*** Basic toggle-switch component.
 * Supports disabled and forced-on states, with keyboard and screen reader accessibility. ***/

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const ToggleSwitch = ({
    onToggle, initial = false, label = "Enable Login", disabled = false, forceOn = false }) => {
    const [enabled, setEnabled] = useState(initial)

    useEffect(() => {
        if (forceOn) setEnabled(true);
    }, [forceOn]);

    /**
     * Toggle state if not disabled/forced-on.
     */
    const handleToggle = () => {
        if (disabled || forceOn) return;
        const newState = !enabled;
        setEnabled(newState)
        if (onToggle) onToggle(newState)
    }
    return (
        <label className="flex flex-col items-center gap-1 cursor-pointer select-none">
            <motion.div
                onClick={handleToggle}
                whileTap={{ scale: disabled || forceOn ? 1 : 0.9 }}
                className={`relative w-12 h-6 rounded-full flex items-center px-1 focus:outline-none 
        focus-visible:ring-2 focus-visible:ring-blue-400 transition-colors duration-300
        ${enabled ? "bg-blue-600" : "bg-gray-300"} ${disabled || forceOn ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                role="switch"
                aria-checked={enabled}
                aria-label={label}
                tabIndex={0}
                onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === " ") && !disabled && !forceOn) {
                        e.preventDefault();
                        handleToggle();
                    }
                }}>
                <motion.div
                    layout
                    animate={{ x: enabled ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-4 h-4 bg-white rounded-full shadow"
                />
            </motion.div>
            <span className="text-xs sm:text-sm font-bold text-gray-700">{label}</span>
        </label>
    )
}

export default ToggleSwitch;