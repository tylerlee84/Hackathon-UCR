import React from 'react';

export const LoadingSpinner = () => {
    const style = `
        @keyframes rotate {
            100% { transform: rotate(360deg); }
        }
        @keyframes dash {
            0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
            50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
            100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
        }
    `;

    return (
        <>
            <style>{style}</style>
            <svg className="w-16 h-16" style={{ animation: 'rotate 2s linear infinite' }} viewBox="0 0 50 50">
                <defs>
                    <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22d3ee" /> 
                        <stop offset="100%" stopColor="#d946ef" />
                    </linearGradient>
                </defs>
                <circle
                    className="path"
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    stroke="url(#spinnerGradient)"
                    strokeWidth="5"
                    style={{
                        strokeLinecap: 'round',
                        animation: 'dash 1.5s ease-in-out infinite'
                    }}
                ></circle>
            </svg>
        </>
    );
};
