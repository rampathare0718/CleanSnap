import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CleanSnapLogo from "../../assets/cleansnap_logo.png";
import MainImage from "../../assets/cleansnap_main.jpg";

const CleanSnapLanding = () => {
  const navigate = useNavigate();

  // Section References for Smooth Scrolling
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const howItWorksRef = useRef(null);

  const scrollToSection = (elementRef) => {
    elementRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-800 font-sans">
      
      {/* ================= 1. TOPBAR / NAVBAR ================= */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-purple-300/95 backdrop-blur-md shadow-sm">
        
        {/* Left Side: Brand Logo & Swachh Bharat */}
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Clean<span className="text-green-700">Snap</span>
            </span>
          </div>
          
          <div className="h-7 w-px bg-slate-300"></div>

          <div className="flex items-center">
            <img
                src={CleanSnapLogo}
                alt="CleanSnap"
                className="h-9 object-contain"
            />
          </div>
        </div>

        {/* Right Side: Navigation Menu */}
        <nav className="flex items-center gap-2 md:gap-6">
          <button 
            onClick={() => scrollToSection(homeRef)}
            className="text-slate-700 hover:text-green-700 font-medium px-3 py-2 text-sm md:text-base transition-colors"
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection(aboutRef)}
            className="text-slate-700 hover:text-green-700 font-medium px-3 py-2 text-sm md:text-base transition-colors"
          >
            About Us
          </button>
          <button 
            onClick={() => scrollToSection(howItWorksRef)}
            className="text-slate-700 hover:text-green-700 font-medium px-3 py-2 text-sm md:text-base transition-colors"
          >
            How It Works
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="ml-2 bg-green-700 hover:bg-green-800 text-white font-semibold text-sm md:text-base px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            Login / Register
          </button>
        </nav>
      </header>

      {/* ================= 2. HERO SECTION ================= */}
      <section
        ref={homeRef}
        className="relative min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${MainImage})` }}
      >
        <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center px-6 text-center">
          <div className="max-w-4xl text-white">
            <span className="inline-block px-4 py-1.5 bg-green-700/90 text-white rounded-full text-xs font-semibold tracking-wider uppercase mb-6">
              Welcome to CleanSnap
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 drop-shadow-md">
              Smart Waste Management & Green Awareness
            </h1>
            <p className="text-lg md:text-2xl font-light italic text-slate-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              “Be the solution, not the pollution. Together for a cleaner, greener tomorrow.”
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={() => scrollToSection(howItWorksRef)}
                className="bg-green-700 hover:bg-green-800 text-white font-semibold px-8 py-3.5 rounded-full text-base transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Explore How It Works
              </button>
              <button 
                onClick={() => scrollToSection(aboutRef)}
                className="border-2 border-white text-white hover:bg-white hover:text-slate-900 font-semibold px-8 py-3.5 rounded-full text-base transition-all"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. ABOUT US SECTION ================= */}
      <section ref={aboutRef} className="py-20 px-6 md:px-16 lg:px-24 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-[length:200%_200%] animate-gradient">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-green-700 font-bold text-xs uppercase tracking-widest">
            About Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">
            Transforming Urban Cleanliness Through Technology
          </h2>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed">
            CleanSnap connects citizens, municipal workers, and administrators on a unified digital platform 
            to drive accountability, transparency, and civic engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="text-4xl mb-4">🏙️</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">For Citizens</h3>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              Report waste issues by capturing photos. Track progress in real-time, rate worker performance, and earn rewards for civic contributions.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="text-4xl mb-4">🚜</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">For Municipal Workers</h3>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              Receive direct task assignments, upload before-and-after proof of cleaning operations, and build a verifiable record of community impact.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">For Administrators</h3>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              Review, approve, and route complaints efficiently. Broadcast government updates and manage citizen points and leaderboards effortlessly.
            </p>
          </div>
        </div>
      </section>

      {/* ================= 4. HOW IT WORKS SECTION ================= */}
      <section ref={howItWorksRef} className="py-20 px-6 md:px-16 lg:px-24 bg-slate-50">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-green-700 font-bold text-xs uppercase tracking-widest">
            Workflow
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">
            How CleanSnap Works
          </h2>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed">
            A transparent 4-step lifecycle ensuring every reported waste issue is resolved efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-green-100 text-green-800 rounded-full flex items-center justify-center font-bold mb-4">
              01
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Report Issue</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Citizens snap a photo of waste or garbage, add location details, and submit a complaint.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-green-100 text-green-800 rounded-full flex items-center justify-center font-bold mb-4">
              02
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Admin Review</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Administrators verify complaints and assign approved cleanup tasks to local field workers.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-green-100 text-green-800 rounded-full flex items-center justify-center font-bold mb-4">
              03
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Cleanup & Proof</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Workers execute the cleanup and upload photographic proof upon completing the job.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-green-100 text-green-800 rounded-full flex items-center justify-center font-bold mb-4">
              04
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Verify & Reward</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Citizens review before-and-after proof, rate the service, and earn reward points on the leaderboard.
            </p>
          </div>
        </div>
      </section>

      {/* ================= 5. FOOTER ================= */}
      <footer className="bg-slate-900 text-slate-100 py-12 px-6 text-center">
        <div className="max-w-xl mx-auto flex flex-col gap-3">
          <h3 className="text-2xl font-bold">
            Clean<span className="text-green-500">Snap</span>
          </h3>
          <p className="text-slate-400 text-sm">
            Supporting Swachh Bharat Abhiyan through technology and active civic engagement.
          </p>
          <p className="text-slate-500 text-xs mt-4">
            © {new Date().getFullYear()} CleanSnap. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default CleanSnapLanding;