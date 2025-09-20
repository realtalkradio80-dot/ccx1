import React, { useState, useEffect, FC } from 'react';

const WindowsLogoSimple: FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-20 h-20 animate-pulse">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
    </svg>
);


export const BootScreen: React.FC = () => {
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('Starting WinTube OS...');

    useEffect(() => {
        const messages = [
            'Initializing kernel...',
            'Loading system drivers...',
            'Verifying system integrity...',
            'Mounting file systems...',
            'Starting network services...',
            'Loading user profile...',
            'Finalizing setup...',
            'Welcome!'
        ];

        let progressInterval: number;
        let messageInterval: number;
        
        // Update progress smoothly
        progressInterval = window.setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 1;
            });
        }, 35);

        // Update messages at a different pace
        let messageIndex = 0;
        messageInterval = window.setInterval(() => {
            if(messageIndex < messages.length - 1) {
                messageIndex++;
                setMessage(messages[messageIndex]);
            } else {
                clearInterval(messageInterval);
            }
        }, 500);


        return () => {
            clearInterval(progressInterval);
            clearInterval(messageInterval);
        };
    }, []);

    return (
        <div className="h-screen w-screen bg-blue-900 flex flex-col items-center justify-center text-white font-mono select-none">
            <div className="mb-8">
                <WindowsLogoSimple />
            </div>
            <h1 className="text-4xl font-bold mb-12">WinTube OS</h1>
            
            <div className="w-full max-w-md bg-gray-700 rounded-full h-2.5">
                <div className="bg-white h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div>
            </div>
            <p className="mt-4 text-sm text-gray-300 w-full max-w-md text-center">{message}</p>
        </div>
    );
};
