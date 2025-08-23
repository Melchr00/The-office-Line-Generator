/*** Animated gradient border wrapper.
 * Provides a rotating conic gradient around its children. ***/

import { motion } from "framer-motion";

export const GradientBorder = ({ gradient, children }) => (
    <div className="relative p-1 rounded-2xl overflow-visible">
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ background: gradient, zIndex: 1 }}
            aria-hidden="true"
        />
        <div className="absolute inset-1 rounded-xl bg-white z-10" aria-hidden="true"></div>
        <div className="relative rounded-xl bg-white z-20">{children}</div>
    </div>
);