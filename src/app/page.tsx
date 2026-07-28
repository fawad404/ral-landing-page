import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Demo Banner */}
      {/* <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-center text-sm py-2.5 px-4">
        <span className="font-semibold">DEMO PORTAL</span> — This is a
        simulated experience. No real data is collected or processed.
      </div> */}

      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="RAL Connect"
              width={915}
              height={457}
              priority
              className="h-10 w-auto object-contain"
            />
          </div>
          <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-semibold">
            Demo Portal
          </span>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-sm px-4 py-2 rounded-full mb-8 border border-white/20"
          >
            <span
              className="w-2 h-2 bg-green-400 rounded-full"
              style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
            />
            Interactive Demo — Takes less than 2 minutes
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
            See How RAL Connect
            <br />
            Works for You
          </h1>
          <p className="text-blue-200 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            RAL Connect connects Arizona assisted living homes with the right
            residents — directly and without the traditional placement fees.
            Select your role below to experience a live simulation.
          </p>
        </div>
      </div>

      {/* Role Selector */}
      <div className="flex-1 bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-400 text-xs mb-10 uppercase tracking-widest font-semibold">
            Choose your role to begin
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Discharge Planner Card */}
            <Link href="/discharge-planner" className="group block">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-300 h-full flex flex-col cursor-pointer">
                <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-100 transition-colors">
                  <svg
                    className="w-7 h-7 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div className="mb-2">
                  <span className="text-xs font-semibold bg-teal-100 text-teal-700 px-2.5 py-1 rounded-full">
                    For Hospital Staff
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3 mt-3">
                  Discharge Planner /
                  <br />
                  Social Worker
                </h2>
                <p className="text-gray-500 mb-8 flex-1 leading-relaxed text-sm">
                  See how quickly you can find matched assisted living homes for
                  your patients — based on care needs, budget, and location.
                  No more calling home after home.
                </p>
                <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                  <span className="text-xs text-gray-400">~2 min experience</span>
                  <div className="flex items-center gap-2 text-teal-700 font-semibold text-sm group-hover:gap-3 transition-all">
                    Enter Demo
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Facility Owner Card */}
            <Link href="/facility" className="group block">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 h-full flex flex-col cursor-pointer">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                  <svg
                    className="w-7 h-7 text-blue-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <div className="mb-2">
                  <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
                    For RAL Owners
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3 mt-3">
                  Residential Assisted
                  <br />
                  Living Owner
                </h2>
                <p className="text-gray-500 mb-8 flex-1 leading-relaxed text-sm">
                  See how RAL Connect fills your beds with the right residents
                  through direct referrals from discharge planners — without
                  high placement agency fees.
                </p>
                <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                  <span className="text-xs text-gray-400">~2 min experience</span>
                  <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm group-hover:gap-3 transition-all">
                    Enter Demo
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Trust line */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm">
              Built for Arizona ALF operators and hospital discharge teams.
              <span className="text-gray-300 mx-2">·</span>
              Serving Maricopa County.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 px-6 text-center">
        <p className="text-gray-400 text-xs">
          © 2026 RAL Connect · Demo Portal · No real data is collected or
          processed
        </p>
      </footer>
    </div>
  );
}
