import { useEffect, useRef, useState } from "react";
import englishVideo from "../../assets/video/English.mp4";
import kannadaVideo from "../../assets/video/Kannada.mp4";

export default function SafetyVideo({ onNext }) {
    const [seconds, setSeconds] = useState(5);
    const [language, setLanguage] = useState("english");
    const videoRef = useRef(null);

    // Countdown timer
    useEffect(() => {
        if (seconds === 0) return;
        const timer = setTimeout(() => setSeconds((prev) => prev - 1), 1000);
        return () => clearTimeout(timer);
    }, [seconds]);

    // Replay handler
    const handleReplay = () => {
        setSeconds(5);
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.dataset.lastTime = 0;
            videoRef.current.play().catch(e => console.error("Play failed", e));
        }
    };

    // Language toggle handler
    const handleLanguageToggle = (lang) => {
        setLanguage(lang);
        setSeconds(5); // Reset timer on language switch
    };

    // Prevent seeking
    const handleSeeking = () => {
        if (videoRef.current) {
            videoRef.current.currentTime =
                videoRef.current.dataset.lastTime || 0;
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            videoRef.current.dataset.lastTime = videoRef.current.currentTime;
        }
    };

    const formatTime = (secs) => {
        const m = String(Math.floor(secs / 60)).padStart(2, "0");
        const s = String(secs % 60).padStart(2, "0");
        return `${m}:${s}`;
    };

    return (
        <div className="flex justify-center p-0 m-0 w-full">
            <div className="w-full max-w-none bg-white/5 rounded-xl p-4 flex flex-col gap-4">
                
                {/* LANGUAGE TOGGLE */}
                <div className="flex justify-center gap-3">
                    <button 
                        onClick={() => handleLanguageToggle("english")}
                        className={`px-5 py-1.5 rounded-full text-sm font-bold transition flex items-center justify-center shadow-md ${
                            language === "english" 
                                ? "bg-indigo-600 text-white shadow-indigo-500/25" 
                                : "bg-white/10 text-white/60 hover:bg-white/20"
                        }`}
                    >
                        English
                    </button>
                    <button 
                        onClick={() => handleLanguageToggle("kannada")}
                        className={`px-5 py-1.5 rounded-full text-sm font-bold transition flex items-center justify-center shadow-md ${
                            language === "kannada" 
                                ? "bg-indigo-600 text-white shadow-indigo-500/25" 
                                : "bg-white/10 text-white/60 hover:bg-white/20"
                        }`}
                    >
                        ಕನ್ನಡ
                    </button>
                </div>

                {/* VIDEO */}
                <div className="w-full bg-black rounded-xl overflow-hidden relative border border-white/10 shadow-lg">
                    <video
                        ref={videoRef}
                        key={language} // Forces reload when language changes
                        src={language === "english" ? englishVideo : kannadaVideo}
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

                {/* TIMER & PROGRESS */}
                {seconds > 0 ? (
                    <div className="text-center space-y-1">
                        <p className="text-sm font-semibold text-amber-400 animate-pulse">
                            Please watch the safety video
                        </p>
                        <p className="text-xs text-slate-400">
                            You can proceed in {formatTime(seconds)}
                        </p>
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="text-sm font-bold text-green-400">
                            ✅ Thank you for watching
                        </p>
                    </div>
                )}

                {/* ACTION BUTTONS */}
                {seconds === 0 ? (
                    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
                        <button
                            onClick={handleReplay}
                            className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center gap-2 font-semibold transition border border-slate-600 shadow-md"
                        >
                            <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Replay
                        </button>
                        <button
                            onClick={onNext}
                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white flex items-center justify-center gap-2 font-bold transition shadow-lg hover:shadow-green-500/25"
                        >
                            Continue
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <div className="flex justify-center mt-2">
                        <button
                            disabled
                            className="w-full py-3 rounded-xl bg-slate-700/40 text-slate-500 font-semibold cursor-not-allowed transition border border-white/5"
                        >
                            Proceeding in {seconds}s...
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
