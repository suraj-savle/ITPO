import { Link } from "react-router-dom";
import {
  Briefcase,
  Users,
  Trophy,
  Grid,
  ArrowRight,
  ChevronsDown,
} from "lucide-react";
// import { useState,  } from "react";

// Simple SVG icons
const ChevronDownIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

export default function Landing() {
  // const [scrollY, setScrollY] = useState(0);

  // useEffect(() => {
  //   const handleScroll = () => setScrollY(window.scrollY);
  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, []);

  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const features = [
    {
      title: "Internships",
      desc: "Gain Experience with Industry Leaders",
      color: "from-green-50 to-green-100",
      hoverColor: "hover:from-green-100 hover:to-green-200",
      icon: <Briefcase className="w-6 h-6 text-green-600" />,
      stats: "500+ Opportunities",
    },
    {
      title: "Mentorships",
      desc: "1:1 Guidance from Industry Experts",
      color: "from-orange-50 to-orange-100",
      hoverColor: "hover:from-orange-100 hover:to-orange-200",
      icon: <Users className="w-6 h-6 text-orange-600" />,
      stats: "100+ Mentors",
    },
    {
      title: "Placement Cell",
      desc: "Career Support & Placement Assistance",
      color: "from-blue-50 to-blue-100",
      hoverColor: "hover:from-blue-100 hover:to-blue-200",
      icon: <Trophy className="w-6 h-6 text-blue-600" />,
      stats: "87% Success Rate",
    },
    {
      title: "Recruiter",
      desc: "Career Support & Internship Assistance",
      color: "from-purple-50 to-purple-100",
      hoverColor: "hover:from-purple-100 hover:to-purple-200",
      icon: <Grid className="w-6 h-6 text-purple-600" />,
      stats: "1000+ internships posted",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 transition-all duration-300">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center py-4">
      {/* Logo + Brand */}
      <div className="flex items-center space-x-2 group">
        <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold transform transition-transform duration-300 group-hover:rotate-12">
          IC
        </div>
        <span className="text-xl font-bold text-indigo-700 group-hover:text-purple-600 transition-colors duration-300">
          InternConnect
        </span>
      </div>

      {/* Links (Desktop) */}
      <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
        <a
          href="#features"
          className="text-gray-600 hover:text-indigo-600 transition-colors duration-300"
        >
          Features
        </a>
        <a
          href="#how-it-works"
          className="text-gray-600 hover:text-indigo-600 transition-colors duration-300"
        >
          How It Works
        </a>
        <a
          href="#contact"
          className="text-gray-600 hover:text-indigo-600 transition-colors duration-300"
        >
          Contact
        </a>
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <Link
          to="/login"
          className="px-4 py-2 rounded-lg text-sm sm:text-base font-medium border border-gray-300 text-gray-600 hover:text-indigo-600 hover:border-indigo-600 transition-all duration-300 hover:scale-105"
        >
          Sign In
        </Link>
        <Link
          to="/register"
          className="px-4 py-2 rounded-lg text-sm sm:text-base font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          Register
        </Link>
      </div>
    </div>
  </div>
</nav>


      {/* Hero Section */}
      <header className="relative min-h-screen bg-white text-black overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-48 h-48 md:w-72 md:h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-64 h-64 md:w-96 md:h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-48 h-48 md:w-64 md:h-64 bg-indigo-300/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        {/* Content wrapper */}
        <div className="relative max-w-7xl mx-auto px-6 pt-24 md:pt-32 pb-16 flex flex-col lg:flex-row items-center min-h-screen">
          {/* Left content */}
          <div className="w-full lg:w-1/2 mb-10 lg:mb-0 animate-fade-in-up text-center lg:text-left">
            <div className="inline-block px-4 py-2 bg-indigo-100 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium mb-6 animate-bounce-in">
              🚀 Revolutionizing Campus Placements
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Unlock
              <span className="bg-gradient-to-r pl-2 from-yellow-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                Your Career
              </span>
              <br />
              In InternConnect
            </h1>
            <p
              className="text-base sm:text-lg md:text-xl mb-8 opacity-90 animate-fade-in-up max-w-lg mx-auto lg:mx-0"
              style={{ animationDelay: "0.2s" }}
            >
              A campus-centric platform that replaces the maze of PDFs, emails,
              and spreadsheets with a streamlined, transparent process for
              students, placement cells, and employers.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <Link
                to="/register"
                className="group px-6 sm:px-8 py-3 sm:py-4 bg-white text-indigo-600 hover:text-white hover:bg-indigo-600 font-semibold rounded-xl shadow-lg hover:shadow-2xl text-center transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                <span className="flex items-center justify-center gap-2">
                  Get Started Free
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
                </span>
              </Link>
            </div>
          </div>

          {/* Right features grid */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-lg">
              {/* Animated background elements */}
              <div className="absolute -top-6 -left-6 w-40 h-40 md:w-72 md:h-72 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full animate-float-slow"></div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 md:w-72 md:h-72 bg-gradient-to-l from-green-400/10 to-cyan-400/10 rounded-full animate-float-slow-reverse"></div>

              {/* Feature Cards Grid */}
              <div className="relative grid grid-cols-2 sm:grid-cols-2 gap-4 md:gap-8">
                {features.map((feature, index) => (
                  <Link to="/login" key={index} className="group relative">
                    <div
                      className={`
                  relative bg-gradient-to-br ${feature.color}
                  rounded-2xl sm:rounded-3xl p-4 sm:p-5
                  border border-white/50 
                  transition-all duration-500 transform hover:scale-105
                  flex flex-col justify-between
                  overflow-hidden h-full
                `}
                    >
                      {/* Background Pattern */}
                      <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-white/20 rounded-full -translate-y-10 sm:-translate-y-16 translate-x-10 sm:translate-x-16"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-white/20 rounded-full translate-y-8 sm:translate-y-12 -translate-x-8 sm:-translate-x-12"></div>

                      {/* Content */}
                      <div className="relative z-10">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-2">
                          {feature.icon}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-2">
                          {feature.desc}
                        </p>
                        <div className="flex items-center text-xs sm:text-sm font-medium text-gray-600">
                          <span className="bg-white/50 px-2 sm:px-3 py-1 rounded-full">
                            {feature.stats}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDownIcon className=" h-10 md:w-10 md:h-10 text-gray-300" />
        </div>
      </header>

      {/* Stats Section */}
      <section
        id="stats"
        className="py-16 bg-gradient-to-r from-indigo-50 to-purple-50 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group hover:scale-110 transition-transform duration-300">
              <div
                className="text-4xl font-bold text-indigo-600 mb-2 counter"
                data-target="50"
              >
                50+
              </div>
              <div className="text-gray-600 group-hover:text-indigo-600 transition-colors">
                Partner Institutions
              </div>
            </div>
            <div
              className="group hover:scale-110 transition-transform duration-300"
              style={{ animationDelay: "0.1s" }}
            >
              <div
                className="text-4xl font-bold text-indigo-600 mb-2 counter"
                data-target="500"
              >
                500+
              </div>
              <div className="text-gray-600 group-hover:text-indigo-600 transition-colors">
                Company Partners
              </div>
            </div>
            <div
              className="group hover:scale-110 transition-transform duration-300"
              style={{ animationDelay: "0.2s" }}
            >
              <div
                className="text-4xl font-bold text-indigo-600 mb-2 counter"
                data-target="10000"
              >
                10K+
              </div>
              <div className="text-gray-600 group-hover:text-indigo-600 transition-colors">
                Active Students
              </div>
            </div>
            <div
              className="group hover:scale-110 transition-transform duration-300"
              style={{ animationDelay: "0.3s" }}
            >
              <div
                className="text-4xl font-bold text-indigo-600 mb-2 counter"
                data-target="5000"
              >
                5K+
              </div>
              <div className="text-gray-600 group-hover:text-indigo-600 transition-colors">
                Successful Placements
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-24 bg-gradient-to-br from-gray-50 via-white to-indigo-50 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full text-indigo-700 font-semibold text-sm mb-6">
              🎯 Complete Solution
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-8 leading-tight">
              Complete
              <span className="bg-gradient-to-r pl-2 from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                Campus Placement
              </span>
              <br />
              Ecosystem
            </h2>
            <p className="text-2xl text-gray-600 leading-relaxed">
              Connecting students, mentors, recruiters, and placement officers
              in one unified, intelligent platform
            </p>
          </div>

          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
            {/* Student Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 border border-indigo-100"></div>
              <div className="relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-2">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full">
                      1.2K+ Active
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Students
                </h3>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-700">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium">
                      Apply to internships
                    </span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium">
                      Track applications
                    </span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium">
                      Download certificates
                    </span>
                  </li>
                </ul>

                <div className="pt-4 border-t border-gray-100">
                  <button className="w-full py-2.5 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-100 transition-colors duration-300 flex items-center justify-center gap-2">
                    Explore Features
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Mentors Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-white rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 border border-purple-100"></div>
              <div className="relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-2">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-purple-50 text-purple-600 text-xs font-medium rounded-full">
                      200+ Experts
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Mentors
                </h3>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-700">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium">
                      Approve student requests
                    </span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium">
                      Provide expert feedback
                    </span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium">
                      Track student progress
                    </span>
                  </li>
                </ul>

                <div className="pt-4 border-t border-gray-100">
                  <button className="w-full py-2.5 bg-purple-50 text-purple-600 text-sm font-medium rounded-lg hover:bg-purple-100 transition-colors duration-300 flex items-center justify-center gap-2">
                    Explore Features
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Recruiters Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-white rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 border border-green-100"></div>
              <div className="relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-2">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full">
                      150+ Companies
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Recruiters
                </h3>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-700">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium">
                      Post job opportunities
                    </span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium">
                      Shortlist candidates
                    </span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium">
                      Schedule interviews
                    </span>
                  </li>
                </ul>

                <div className="pt-4 border-t border-gray-100">
                  <button className="w-full py-2.5 bg-green-50 text-green-600 text-sm font-medium rounded-lg hover:bg-green-100 transition-colors duration-300 flex items-center justify-center gap-2">
                    Explore Features
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Placement Cell Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-white rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 border border-orange-100"></div>
              <div className="relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-2">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-orange-50 text-orange-600 text-xs font-medium rounded-full">
                      87% Success
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Placement Cell
                </h3>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-700">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium">Manage openings</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium">
                      Monitor analytics
                    </span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium">
                      Generate certificates
                    </span>
                  </li>
                </ul>

                <div className="pt-4 border-t border-gray-100">
                  <button className="w-full py-2.5 bg-orange-50 text-orange-600 text-sm font-medium rounded-lg hover:bg-orange-100 transition-colors duration-300 flex items-center justify-center gap-2">
                    Explore Features
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-3"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-20"></div>

        <div className="max-w-7xl mx-auto px-6 relative">
          {/* Section Header */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-500 rounded-full text-white font-medium text-sm mb-6">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                  clipRule="evenodd"
                />
              </svg>
              Streamlined Process
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How Our Platform
              <span className="block bg-gradient-to-r  from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Works for You
              </span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              A comprehensive journey from student registration to successful
              placement - designed for efficiency and success
            </p>
          </div>

          {/* Process Steps */}
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-20 left-20 right-20 h-0.5 bg-gradient-to-r from-gray-200 via-blue-200 to-gray-200">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 w-full h-full scale-x-0 origin-left animate-connect-line"></div>
            </div>

            {/* Step 1 - Profile Creation */}
            <div className="group text-center relative">
              <div className="relative mb-8">
                <div className="w-16 h-16 bg-white border-4 border-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 relative z-10 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-md">
                    1
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 group-hover:shadow-lg group-hover:border-blue-100 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-3">
                  Create Digital Profile
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Build a comprehensive profile with academic records, skills,
                  and professional credentials
                </p>
              </div>
            </div>

            {/* Step 2 - Opportunity Discovery */}
            <div className="group text-center relative">
              <div className="relative mb-8">
                <div className="w-16 h-16 bg-white border-4 border-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 relative z-10 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-md">
                    2
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 group-hover:shadow-lg group-hover:border-indigo-100 transition-all duration-300">
                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-3">
                  Discover Opportunities
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Smart algorithm matches you with ideal internships and
                  training programs
                </p>
              </div>
            </div>

            {/* Step 3 - Application & Tracking */}
            <div className="group text-center relative">
              <div className="relative mb-8">
                <div className="w-16 h-16 bg-white border-4 border-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 relative z-10 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-md">
                    3
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 group-hover:shadow-lg group-hover:border-purple-100 transition-all duration-300">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-3">
                  Apply & Track Progress
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  One-click applications with real-time status updates and
                  interview scheduling
                </p>
              </div>
            </div>

            {/* Step 4 - Completion & Certification */}
            <div className="group text-center relative">
              <div className="relative mb-8">
                <div className="w-16 h-16 bg-white border-4 border-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 relative z-10 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-md">
                    4
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 group-hover:shadow-lg group-hover:border-green-100 transition-all duration-300">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-3">
                  Complete & Get Certified
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Receive digital certificates and verifiable completion records
                  for your portfolio
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Ready to Start Your Journey?
              </h3>
              <p className="text-gray-600 mb-6">
                Join thousands of students who have transformed their careers
                through our platform
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Get Started Now
                </button>
                <button className="px-8 py-3 bg-white text-gray-700 rounded-lg font-medium border border-gray-300 hover:border-gray-400 transition-all duration-300">
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-80 h-80 bg-purple-300/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
        <div className="max-w-5xl mx-auto px-6 text-center relative">
          <div className="inline-block px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white font-semibold text-sm mb-8 animate-bounce-in">
            🚀 Transform Your Institution
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
            Ready to Transform Your
            <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent animate-gradient">
              Campus Placement
            </span>
            <br />
            Program?
          </h2>
          <p className="text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Join technical institutions across India in revolutionizing
            industrial training and campus placements
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
            <Link
              to="/register"
              className="group px-10 py-5 bg-white text-indigo-600 hover:text-white hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1"
            >
              <span className="flex items-center justify-center gap-3">
                Get Started Now
                <svg
                  className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300"
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
              </span>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">
                Free for technical institutions
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">AICTE compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Why Choose Our Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built specifically for technical institutions to streamline the
              entire placement process
            </p>
          </div>

          <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-6">
            <div className="group bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                One-click applications
              </h3>
              <p className="text-sm text-gray-600">
                Apply instantly with saved profiles
              </p>
            </div>

            <div className="group bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Automated mentor approval
              </h3>
              <p className="text-sm text-gray-600">
                Streamlined faculty workflows
              </p>
            </div>

            <div className="group bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-2xl hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Interview scheduling sync
              </h3>
              <p className="text-sm text-gray-600">Seamless coordination</p>
            </div>

            <div className="group bg-gradient-to-br from-yellow-50 to-orange-100 p-6 rounded-2xl hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Digital certificates & analytics
              </h3>
              <p className="text-sm text-gray-600">
                Automated tracking & reports
              </p>
            </div>

            <div className="group bg-gradient-to-br from-red-50 to-rose-100 p-6 rounded-2xl hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Secure, campus-controlled
              </h3>
              <p className="text-sm text-gray-600">Complete data security</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 bg-gradient-to-br from-slate-50 to-gray-100"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Connect With Us
            </h2>
            <p className="text-xl text-gray-600">
              Ready to transform your campus placement process?
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Email Us
              </h3>
              <div className="text-center space-y-2">
                <p className="text-gray-600 font-medium">
                  placement@itpo.edu.in
                </p>
                <p className="text-gray-600 font-medium">support@itpo.edu.in</p>
              </div>
            </div>
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Call Us
              </h3>
              <div className="text-center space-y-2">
                <p className="text-gray-600 font-medium">+91 98765 43210</p>
                <p className="text-gray-600 font-medium">+91 87654 32109</p>
              </div>
            </div>
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Visit Us
              </h3>
              <div className="text-center space-y-2">
                <p className="text-gray-600 font-medium">
                  Industrial Training & Placement Office
                </p>
                <p className="text-gray-600 font-medium">
                  Government of Rajasthan
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center bg-white rounded-full shadow-md px-6 py-3">
              <span className="text-gray-700 font-medium mr-4">
                Supported by:
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex justify-center items-center">
                  <div className="bg-white w-3 h-3 rounded-full"></div>
                </div>
                <span className="font-bold text-gray-800">
                  Government of Rajasthan
                </span>
              </div>
            </div>
            <p className="text-gray-600 mt-4 text-sm">
              Directorate of Technical Education (DTE) | Smart Education
              Initiative
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">IC</span>
                </div>
                <div>
                  <span className="text-2xl font-bold text-white">
                    InternConnect
                  </span>
                  <p className="text-sm text-gray-400 mt-1">
                    Government of Rajasthan
                  </p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Industrial Training & Placement Management System for Technical
                Institutions under Directorate of Technical Education.
              </p>
              <div className="flex space-x-4 mt-6">
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-500 transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-500 transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-500 transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.094.113.108.212.08.326-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-6">
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/login"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Internship Opportunities
                  </a>
                </li>
                <li>
                  <a
                    href="/login"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Placement Cell
                  </a>
                </li>
                <li>
                  <a
                    href="/login"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Faculty Mentors
                  </a>
                </li>
                <li>
                  <a
                    href="/login"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Student Portal
                  </a>
                </li>
                <li>
                  <a
                    href="/login"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Recruiter Login
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-6">
                Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/help"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="/tutorials"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Video Tutorials
                  </a>
                </li>
                <li>
                  <a
                    href="/faq"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="/documents"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="/support"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Technical Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-6">
                Contact Us
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <svg
                    className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-gray-400">
                    Directorate of Technical Education, Rajasthan
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-4 h-4 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-gray-400">+91-141-1234567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-4 h-4 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-400">dte.rajasthan@gov.in</span>
                </div>
              </div>

              {/* Newsletter Subscription */}
              <div className="mt-6">
                <h4 className="text-white font-medium mb-3 text-sm">
                  Stay Updated
                </h4>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-3 py-2 bg-gray-800 text-white text-sm rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  />
                  <button className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-500 transition-colors text-sm font-medium">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="text-gray-400 text-sm">
                  © {new Date().getFullYear()} InternConnect - Directorate of
                  Technical Education, Government of Rajasthan. All rights
                  reserved.
                </p>
              </div>

              <div className="flex space-x-6 text-sm">
                <a
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="/accessibility"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Accessibility
                </a>
                <a
                  href="/sitemap"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Sitemap
                </a>
              </div>
            </div>

            {/* Official Badge */}
            <div className="text-center mt-4 pt-4 border-t border-gray-800">
              <p className="text-xs text-gray-500">
                An initiative under Smart Education Theme - Transforming
                technical education through digital innovation
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
