import { useState, useEffect } from 'react';

const useCountdownTimer = (secondsCount, resetTimer) => {
    const [seconds, setSeconds] = useState(secondsCount);

    useEffect(() => {
        setSeconds(secondsCount);
    }, [resetTimer, secondsCount]);

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((prevSeconds) => {
                if (prevSeconds === 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prevSeconds - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [secondsCount, resetTimer]);

    return seconds;
};

export default useCountdownTimer;
