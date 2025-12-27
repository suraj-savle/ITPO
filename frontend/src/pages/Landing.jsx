import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  Briefcase,
  Users,
  Trophy,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  Brain,
  BarChart,
  Zap,
  ChevronRight,
  Award,
  Building,
  Target,
  CheckCircle,
  Shield,
  Calendar,
  FileText,
  TrendingUp,
  Cpu,
  Users2,
  Mail,
  Phone,
  MapPin
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
      title: "AI-Powered Matching",
      desc: "Advanced algorithms match students with ideal opportunities using skill-based profiling",
      icon: <Brain className="w-6 h-6" />,
      metric: "95% Match Accuracy",
      delay: 0.1
    },
    {
      title: "Real-time Analytics",
      desc: "Comprehensive dashboard with placement metrics, performance tracking, and insights",
      icon: <BarChart className="w-6 h-6" />,
      metric: "Live Reporting",
      delay: 0.2
    },
    {
      title: "Enterprise Security",
      desc: "Bank-grade security, data encryption, and guaranteed 99.9% platform uptime",
      icon: <Shield className="w-6 h-6" />,
      metric: "SOC2 Certified",
      delay: 0.3
    },
    {
      title: "Automated Workflows",
      desc: "Streamlined processes reduce administrative work by 70% with smart automation",
      icon: <Zap className="w-6 h-6" />,
      metric: "70% Time Saved",
      delay: 0.4
    },
    {
      title: "Performance Tracking",
      desc: "Monitor student progress, interview outcomes, and placement statistics in real-time",
      icon: <TrendingUp className="w-6 h-6" />,
      metric: "360° Insights",
      delay: 0.5
    },
    {
      title: "Smart Scheduling",
      desc: "Automated interview scheduling, calendar integration, and conflict resolution",
      icon: <Calendar className="w-6 h-6" />,
      metric: "Zero Conflicts",
      delay: 0.6
    },
  ];

  const stats = [
    { number: "10,832+", label: "Students Successfully Placed", icon: <Users className="w-5 h-5" /> },
    { number: "527+", label: "Partner Companies", icon: <Building className="w-5 h-5" /> },
    { number: "95.3%", label: "Placement Success Rate", icon: <Trophy className="w-5 h-5" /> },
    { number: "62+", label: "Leading Institutions", icon: <Award className="w-5 h-5" /> }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Profile & Skill Mapping",
      description: "Students create detailed profiles with skills, academics, projects, and career preferences",
      icon: <FileText className="w-6 h-6" />,
      details: ["Skill assessment", "Portfolio upload", "Career preference setup"]
    },
    {
      step: "02",
      title: "Intelligent Matching",
      description: "AI algorithms analyze profiles and match with optimal opportunities based on multiple parameters",
      icon: <Cpu className="w-6 h-6" />,
      details: ["AI analysis", "Multi-factor matching", "Opportunity ranking"]
    },
    {
      step: "03",
      title: "Streamlined Placement",
      description: "Automated interview scheduling, real-time tracking, and seamless hiring process management",
      icon: <Target className="w-6 h-6" />,
      details: ["Automated scheduling", "Progress tracking", "Analytics dashboard"]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Head of Career Services, Stanford University",
      content: "InternConnect reduced our placement process from weeks to days. The AI matching is incredibly accurate.",
      company: "Stanford University"
    },
    {
      name: "Michael Rodriguez",
      role: "HR Director, Microsoft",
      content: "The quality of candidates matched through InternConnect has been exceptional. Highly efficient platform.",
      company: "Microsoft"
    },
    {
      name: "Dr. James Wilson",
      role: "Dean of Engineering, MIT",
      content: "Transformed our campus placement process. 40% more placements in the first semester itself.",
      company: "MIT"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-bold text-gray-900 tracking-tight">InternConnect</span>
              <span className="text-xs text-gray-500 font-medium px-2 py-1 bg-gray-100 rounded">Enterprise</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium">Features</a>
              <a href="#process" className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium">Process</a>
              <a href="#results" className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium">Results</a>
              <a href="#testimonials" className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium">Testimonials</a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium">
                Sign In
              </Link>
              <Link to="/register" className="bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-black transition-colors text-sm font-medium shadow-sm">
                Get Started
              </Link>
            </div>

            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
            </button>
          </div>

          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-200"
            >
              <div className="px-4 py-4 space-y-3">
                <a href="#features" className="block text-gray-700 py-2 hover:text-gray-900 font-medium">Features</a>
                <a href="#process" className="block text-gray-700 py-2 hover:text-gray-900 font-medium">Process</a>
                <a href="#results" className="block text-gray-700 py-2 hover:text-gray-900 font-medium">Results</a>
                <a href="#testimonials" className="block text-gray-700 py-2 hover:text-gray-900 font-medium">Testimonials</a>
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <Link to="/login" className="block text-gray-700 py-2 hover:text-gray-900 font-medium">Sign In</Link>
                  <Link to="/register" className="block bg-gray-900 text-white px-4 py-2.5 rounded-lg text-center font-medium">
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-medium mb-8 border border-gray-200"
            >
              <Sparkles className="w-4 h-4 mr-2 text-gray-600" />
              Trusted by 62+ Leading Institutions Worldwide
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight"
            >
              The Modern Platform for
              <span className="block mt-3 text-gray-900">Campus Placements</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Enterprise-grade AI platform connecting students with opportunities through intelligent matching, 
              automated workflows, and real-time analytics for institutions and companies.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link
                to="/register"
                className="group bg-gray-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-black transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-medium hover:border-gray-400 hover:bg-gray-50 transition-all duration-300">
                Schedule Demo
              </button>
            </motion.div>

            <StaggeredContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex justify-center items-center mb-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600 font-medium leading-tight">{stat.label}</div>
                </motion.div>
              ))}
            </StaggeredContainer>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Enterprise-Grade Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools designed for modern campus placement management
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: feature.delay }}
                className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-900 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-gray-900 transition-colors duration-300">
                  <div className="text-gray-700 group-hover:text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{feature.desc}</p>
                <div className="text-xs font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full inline-block">
                  {feature.metric}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Streamlined Placement Process
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Three-step workflow designed for maximum efficiency and results
            </p>
          </AnimatedSection>

          <div className="relative">
            <div className="hidden lg:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gray-300"></div>
            <div className="grid md:grid-cols-3 gap-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="relative bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-14 h-14 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold mb-6">
                    {step.step}
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">{step.description}</p>
                  <div className="space-y-2">
                    {step.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <ChevronRight className="w-4 h-4 mr-2 text-gray-400" />
                        {detail}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Leading Institutions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See what our partners say about their experience with InternConnect
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-50 rounded-xl p-8 border border-gray-200 hover:border-gray-300 transition-colors duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users2 className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs text-gray-500 mt-1">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic leading-relaxed">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Transform Your Campus Placements?
            </h2>
            <p className="text-gray-300 mb-10 max-w-2xl mx-auto text-lg">
              Join leading institutions worldwide using InternConnect to streamline their placement process 
              and achieve exceptional results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-gray-900 px-8 py-4 rounded-xl font-medium hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-sm"
              >
                Start Free Trial
              </Link>
              <button className="border border-gray-600 text-white px-8 py-4 rounded-xl font-medium hover:bg-white/10 transition-all duration-300">
                Request Enterprise Demo
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-8">No credit card required • 30-day free trial • Full support included</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <h3 className="text-xl font-bold text-white mb-6">InternConnect</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Enterprise-grade platform transforming campus placements through intelligent technology and data-driven insights.
              </p>
              <div className="flex space-x-4 mt-6">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Building className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Trophy className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Platform</h4>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-white transition-colors text-sm">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-sm">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-sm">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-sm">API Access</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Resources</h4>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-white transition-colors text-sm">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-sm">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-sm">Case Studies</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-sm">Webinars</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-center text-sm">
                  <Mail className="w-4 h-4 mr-2" />
                  contact@internconnect.com
                </li>
                <li className="flex items-center text-sm">
                  <Phone className="w-4 h-4 mr-2" />
                  +1 (555) 123-4567
                </li>
                <li className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  San Francisco, CA
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2024 InternConnect. All rights reserved. Enterprise Campus Placement Platform.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-white text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-white text-sm">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-white text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}