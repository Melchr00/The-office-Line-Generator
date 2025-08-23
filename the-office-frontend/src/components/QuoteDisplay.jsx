/*** Component for displaying a quote with character and episode details.
 * Automatically focuses on new quotes for better accessibility. ***/

import { useRef, useEffect } from 'react';

export const QuoteDisplay = ({ quote }) => {
    const quoteRef = useRef(null);

    useEffect(() => {
        if (quote && quoteRef.current) {
            quoteRef.current.focus();
        }
    }, [quote]);

    if (!quote) return null;
    return (
        <blockquote
            ref={quoteRef}
            className='text-center outline-none'
            aria-live="polite"
            aria-atomic="true"
            tabIndex={-1}
        >
            <p className='text-lg sm:text-xl md:text-2xl italic text-gray-800 mb-2'>
                "{quote.line}"
            </p>
            <footer className='font-semibold text-gray-900 mb-1'>
                <cite>{quote.character}</cite>
            </footer>
            <p className='text-sm text-gray-600'>
                Season {quote.season}, Episode {quote.episode}
            </p>
        </blockquote>
    )
}