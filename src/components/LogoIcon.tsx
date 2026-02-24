import React from 'react';

export function LogoIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12 2L2 20h4l2.5-4.5h7L18 20h4L12 2z"
                fill="currentColor"
                fillOpacity="0.2"
            />
            <path
                d="M12 4.5L5.5 16h3.5L12 9l3 7h3.5L12 4.5z"
                fill="currentColor"
            />
            <path
                d="M12 11l-2 3h4l-2-3z"
                fill="currentColor"
            />
        </svg>
    );
}
