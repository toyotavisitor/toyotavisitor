import { useEffect, useRef, useState } from "react";
import safetyVideo from "../../assets/video/English.mp4";

export default function SafetyVideo({ onNext }) {
    const [seconds, setSeconds] = useState(5);
    const videoRef = useRef(null);

    // Countdown timer
    useEffect(() => {
        if (seconds === 0) return;
        const timer = setTimeout(() => setSeconds(prev => prev - 1), 1000);
        return () => clearTimeout(timer);
    }, [seconds]);

    // Prevent seeking
    const handleSeeking = () => {
        if (videoRef.current) {
            videoRef.current.currentTime =
                videoRef.current.dataset.lastTime || 0;
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            videoRef.current.dataset.lastTime =
                videoRef.current.currentTime;
        }
    };

    const formatTime = (secs) => {
        const m = String(Math.floor(secs / 60)).padStart(2, "0");
        const s = String(secs % 60).padStart(2, "0");
        return `${m}:${s}`;
    };

    return (
        <div className="flex justify-center p-0 m-0">
            <div className="w-[98vw] max-w-none bg-white/5 rounded-xl p-0 m-0">

                {/* VIDEO */}
                <div className="w-full bg-black rounded-xl overflow-hidden">
                    <video
                        ref={videoRef}
                        src={safetyVideo}
                        autoPlay
                        playsInline
                        controls={false}
                        controlsList="nodownload fullscreen noremoteplayback"
                        disablePictureInPicture
                        onSeeking={handleSeeking}
                        onTimeUpdate={handleTimeUpdate}
                        className="w-full aspect-video object-contain pointer-events-none"
                    />
                </div>

                {/* TIMER */}
                <p className="text-center text-sm text-white/70">
                    Please watch full video ({formatTime(seconds)})
                </p>

                {/* ACTION BUTTON */}
                <div className="flex justify-center">
                    <button
                        disabled={seconds > 0}
                        onClick={onNext}
                        className={`w-full max-w-md py-2.5 rounded-xl transition font-medium ${seconds > 0
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                            }`}
                    >
                        Proceed to Quiz
                    </button>
                </div>
            </div>
        </div>
    );
}
