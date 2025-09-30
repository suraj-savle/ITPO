import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  Briefcase,
  Users,
  Trophy,
  Grid,
  ArrowRight,
  Menu,
  X,
  Star,
  CheckCircle,
  Sparkles,
  Brain,
  Clock,
  Shield
} from "lucide-react";

const AnimatedSection = ({ children, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StaggeredContainer = ({ children, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function Landing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const features = [
    {
      title: "AI Matching",
      desc: "Smart algorithms match students with perfect opportunities",
      color: "from-purple-50 to-purple-100",
      hoverColor: "hover:from-purple-100 hover:to-purple-200",
      icon: <Brain className="w-6 h-6 text-purple-600" />,
      stats: "95% Accuracy",
    },
    {
      title: "Real-time Tracking",
      desc: "Live updates on applications and placement status",
      color: "from-blue-50 to-blue-100",
      hoverColor: "hover:from-blue-100 hover:to-blue-200",
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      stats: "Instant Updates",
    },
    {
      title: "Secure Platform",
      desc: "Enterprise-grade security with 99.9% uptime",
      color: "from-green-50 to-green-100",
      hoverColor: "hover:from-green-100 hover:to-green-200",
      icon: <Shield className="w-6 h-6 text-green-600" />,
      stats: "99.9% Uptime",
    },
    {
      title: "Smart Analytics",
      desc: "Comprehensive insights and placement analytics",
      color: "from-orange-50 to-orange-100",
      hoverColor: "hover:from-orange-100 hover:to-orange-200",
      icon: <Trophy className="w-6 h-6 text-orange-600" />,
      stats: "Deep Insights",
    },
  ];

  const stats = [
    { number: "10K+", label: "Students Placed" },
    { number: "500+", label: "Partner Companies" },
    { number: "95%", label: "Success Rate" },
    { number: "50+", label: "Institutions" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">IC</span>
              </div>
              <span className="text-xl font-bold text-gray-900">InternConnect</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Get Started
              </Link>
            </div>

            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100"
            >
              <div className="px-4 py-4 space-y-4">
                <a href="#features" className="block text-gray-600">Features</a>
                <a href="#how-it-works" className="block text-gray-600">How it Works</a>
                <a href="#contact" className="block text-gray-600">Contact</a>
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <Link to="/login" className="block text-gray-600">Sign In</Link>
                  <Link to="/register" className="block bg-indigo-600 text-white px-4 py-2 rounded-lg text-center">
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full text-indigo-600 text-sm font-medium mb-8 border border-indigo-100"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Trusted by 50+ Institutions Worldwide
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            >
              The Future of
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block"> Campus Placements</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              AI-powered platform connecting students, mentors, and recruiters with intelligent matching, automated workflows, and real-time analytics.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link
                to="/register"
                className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all duration-300">
                Watch Demo
              </button>
            </motion.div>

            <StaggeredContainer className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="text-center group"
                >
                  <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </StaggeredContainer>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Powerful Features for
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Modern Hiring</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to streamline campus placements and connect talent with opportunities
            </p>
          </AnimatedSection>

          <StaggeredContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
                className={`group bg-gradient-to-br ${feature.color} rounded-2xl p-8 border border-white/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2`}
              >
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{feature.desc}</p>
                <div className="flex items-center text-sm font-medium text-gray-600">
                  <span className="bg-white/50 px-3 py-1 rounded-full">
                    {feature.stats}
                  </span>
                </div>
              </motion.div>
            ))}
          </StaggeredContainer>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              How InternConnect
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to transform your campus hiring experience
            </p>
          </AnimatedSection>

          <StaggeredContainer className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Create Profile",
                description: "Build comprehensive profiles with skills, academics, and career preferences",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                step: "02",
                title: "AI Matching",
                description: "Our intelligent system matches students with perfect opportunities",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                step: "03",
                title: "Track & Hire",
                description: "Monitor progress and complete placements with real-time analytics",
                gradient: "from-green-500 to-emerald-500"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="text-center group"
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${item.gradient} text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {item.step}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </StaggeredContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your
              <span className="block">Campus Hiring?</span>
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join thousands of students and institutions already using InternConnect to revolutionize their placement process
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Start Free Today
              </Link>
              <button className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300">
                Schedule Demo
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">IC</span>
                </div>
                <span className="text-xl font-bold text-white">InternConnect</span>
              </div>
              <p className="text-gray-400 mb-4">
                Revolutionizing campus placements with AI-powered matching and intelligent workflows.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 InternConnect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}