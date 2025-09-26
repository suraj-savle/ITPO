// UnderDevelopment.jsx
import React from "react";

export default function UnderDevelopment() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Animated Construction Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <div className="relative">
              <svg
                className="w-12 h-12 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 1a1 1 0 011 1v1a1 1 0 11-2 0V2a1 1 0 011-1zm4 7a3 3 0 11-6 0 3 3 0 016 0zm-.464 5.95a1 1 0 00-1.414 0l-.707.707a1 1 0 101.414 1.414l.707-.707a1 1 0 000-1.414zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 14.95a1 1 0 001.414 0l.707-.707a1 1 0 00-1.414-1.414l-.707.707a1 1 0 000 1.414zM3 11a1 1 0 100-2H2a1 1 0 100 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
          {/* Pulsing Animation */}
          <div className="absolute inset-0 rounded-2xl bg-indigo-200 opacity-20 animate-pulse"></div>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page Under Development
        </h1>

        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          We're currently building this section to bring you an enhanced
          experience. This feature will be available shortly.
        </p>

        {/* Additional Information */}
        <div className="bg-white/50 rounded-lg p-6 border border-gray-200/50 backdrop-blur-sm">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Estimated Launch: 2-3 weeks</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Go Back
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:from-indigo-700 hover:to-indigo-700"
          >
            Return Home
          </button>
        </div>

        {/* Contact Information */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Need immediate assistance? </p>
          <a
            href="mailto:support.internconnect@gmail.com"
            className="text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
          >
            support@internconnect.gov.in
          </a>
        </div>
      </div>
    </div>
  );
}
