"use client";
import { useRef, useState, useEffect } from "react";

interface Props {
  onOpenModal: () => void;
}

export default function HeroSection({ onOpenModal }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => setIsBuffering(false);
    const onCanPlay = () => setIsBuffering(false);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("stalled", onWaiting);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("canplay", onCanPlay);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("stalled", onWaiting);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("canplay", onCanPlay);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play();
    else video.pause();
  };

  const showButton = !isPlaying || isHovered;

  return (
    <section className="hero-gradient relative overflow-hidden">
      <div className="dot-grid-dark absolute inset-0 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-mid opacity-10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-brand opacity-20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 md:pt-20 md:pb-32 flex flex-col items-center gap-10">
        {/* Video player */}
        <div className="w-full max-w-3xl">
          <div
            className="relative rounded-3xl p-px shadow-2xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(29,122,212,0.6), rgba(9,72,139,0.3), rgba(96,165,250,0.5))",
            }}
          >
            <div
              className="relative w-full aspect-video bg-[#0A0F1E] rounded-[22px] overflow-hidden cursor-pointer"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={togglePlay}
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                src="/api/video"
                poster="/images/heroThumbnail.png"
                loop
                playsInline
                preload="auto"
              />

              {/* Buffering spinner (YouTube-style) */}
              {isBuffering && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin" />
                </div>
              )}

              {/* Play/Pause overlay */}
              {!isBuffering && (
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${showButton ? "opacity-100" : "opacity-0"}`}
                >
                  <div className="w-16 h-16 bg-black/40 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center shadow-2xl hover:bg-black/60 transition-colors">
                    {isPlaying ? (
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6 text-white ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="max-w-3xl flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm text-white/85 text-xs font-semibold px-4 py-2 rounded-full uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-brand-glow animate-pulse" />
            Arizona RAL Intelligence &amp; Media Platform
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.05] tracking-tight">
            Stay Ahead of Every Regulation,{" "}
            <span className="gradient-text-light">
              Every Staffing Shift, Every Arizona Alert
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/65 font-medium leading-relaxed max-w-2xl">
            The free weekly newsletter built for Arizona assisted living owners
            and managers — compliance updates, staffing news, emergency alerts,
            and industry intelligence, all in plain English.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 mt-2 w-full max-w-lg">
            <a
              href="#newsletter-signup"
              className="w-full sm:w-auto bg-gradient-to-r from-[#09488B] to-[#1d7ad4] text-white px-9 py-4 rounded-2xl text-base font-bold hover:from-[#063264] hover:to-[#09488B] transition-all shadow-xl hover:shadow-[#09488B50] hover:-translate-y-0.5 transform text-center"
            >
              Subscribe Free →
            </a>
            <button
              onClick={onOpenModal}
              className="glass-card text-white px-7 py-4 rounded-2xl text-base font-semibold hover:bg-white/15 transition-all"
            >
              Request Information
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-white/50 mt-1">
            {[
              "Free forever",
              "No spam",
              "Built for Arizona ALF owners",
            ].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5 text-brand-glow"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}
