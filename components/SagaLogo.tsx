import React from 'react';

export const SagaLogo: React.FC<{className?: string}> = ({ className }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className={className}
        >
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" /> 
                    <stop offset="100%" stopColor="#d946ef" />
                </linearGradient>
            </defs>
            
            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#logoGradient)" strokeWidth="5" opacity="0.3" />
            
            <g id="core">
                <circle cx="50" cy="50" r="15" fill="url(#logoGradient)" />
                <circle cx="50" cy="50" r="20" fill="none" stroke="#fff" strokeWidth="1.5" strokeDasharray="2 3" opacity="0.8">
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 50 50"
                        to="360 50 50"
                        dur="10s"
                        repeatCount="indefinite"
                    />
                </circle>
            </g>
            
            <g id="orbit1">
                <circle cx="50" cy="50" r="35" fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.5" />
                <circle cx="85" cy="50" r="4" fill="#22d3ee">
                     <animateMotion dur="4s" repeatCount="indefinite">
                        <mpath href="#orbit1path" />
                    </animateMotion>
                </circle>
                <path id="orbit1path" d="M 50, 15 a 35,35 0 1,1 0,70 a 35,35 0 1,1 0,-70" fill="none"/>
            </g>

            <g id="orbit2">
                 <circle cx="50" cy="50" r="25" fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.3" />
                 <circle cx="50" cy="25" r="3" fill="#d946ef">
                     <animateMotion dur="6s" repeatCount="indefinite" >
                        <mpath href="#orbit2path" />
                    </animateMotion>
                 </circle>
                 <path id="orbit2path" d="M 50, 75 a 25,25 0 1,0 0,-50 a 25,25 0 1,0 0,50" fill="none"/>
            </g>
        </svg>
    );
};
