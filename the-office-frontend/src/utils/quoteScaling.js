/*** Utility for scaling quote text based on length ***/
export const getScaleForQuote = (q) => {
    if (!q?.line) return 1;
    const len = q.line.length;
    if (len > 120) return 0.85;
    if (len > 80) return 0.9;
    if (len > 40) return 0.95;
    return 1;
}