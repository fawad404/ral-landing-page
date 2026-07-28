export default function VideoSection() {
  return (
    <section className="bg-surface relative py-24 md:py-32">
      <div className="dot-grid absolute inset-0 opacity-40 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-12">

        {/* Header */}
        <div className="text-center flex flex-col items-center gap-4 max-w-2xl">
          <span className="inline-flex items-center text-xs font-bold text-brand uppercase tracking-widest bg-brand-bg border border-[#09488B20] px-4 py-1.5 rounded-full">
            See It in Action
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-dark leading-tight">
            See How It Works
          </h2>
          <p className="text-base text-text-subtle leading-relaxed">
            Watch a quick overview of how RAL Connect helps you fill beds faster and stay compliant with less effort.
          </p>
        </div>

        {/* Video player */}
        <div className="w-full max-w-4xl">
          {/* Outer glow frame */}
          <div className="relative rounded-3xl p-1 bg-linear-to-br from-[#09488B40] via-[#1d7ad430] to-[#09488B40] shadow-2xl">
            <div className="relative w-full aspect-video bg-[#0A0F1E] rounded-[20px] overflow-hidden">
              {/* Replace src with real YouTube/Vimeo embed URL — no autoplay */}
              <iframe
                className="w-full h-full"
                src="about:blank"
                title="RAL Connect Overview Video"
                frameBorder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />

              {/* Placeholder overlay — remove once real video URL is set */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-linear-to-br from-[#0A0F1E] to-brand-dark">
                <div className="dot-grid-dark absolute inset-0 opacity-50" />
                <div className="relative flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-linear-to-br from-brand to-brand-mid rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-105 transition-transform">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold text-sm">RAL Connect Overview</p>
                    <p className="text-white/40 text-xs mt-1">Video coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
