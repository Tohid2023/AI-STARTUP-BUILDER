import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Sparkles, ArrowRight, Zap, Target, TrendingUp, Cpu, BarChart3, Layout, ChevronRight, Menu, X, CheckCircle2, Lock, Globe, Database } from "lucide-react";

export default function Landing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAdminSetup = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/setup-admin`);
      alert(res.data.message);
    } catch (error) {
      console.error("Admin setup failed:", error);
      alert("Failed to initialize admin credentials.");
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-brand-500/30">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-brand-500 to-brand-700 p-2 rounded-xl text-white shadow-lg shadow-brand-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">AI Startup Builder</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-brand-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-brand-600 transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-brand-600 transition-colors">Pricing</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">
              Log In
            </Link>
            <Link to="/register" className="btn-primary py-2.5 px-5 text-sm">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-[80px] left-0 w-full bg-white shadow-xl z-50 border-t border-gray-100 flex flex-col p-6 gap-6 animate-in slide-in-from-top-2">
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-800">Features</a>
            <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-800">How it Works</a>
            <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-800">Pricing</a>
            <div className="h-px bg-gray-100 w-full"></div>
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-800">
              Log In
            </Link>
            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary w-full py-3 justify-center text-center">
              Get Started
            </Link>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-sm font-bold mb-8 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>AI Startup Generator V2</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
            From Idea to Execution-Ready <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-indigo-600">Startup in 30 Seconds.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Skip weeks of market research. Let our AI generate your complete business model, features, and technical architecture instantly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto btn-primary py-4 px-8 text-lg">
              Generate Idea <ChevronRight className="w-5 h-5" />
            </Link>
            <a href="#product-preview" className="w-full sm:w-auto btn-secondary py-4 px-8 text-lg">
              View Example
            </a>
          </div>
          <p className="mt-6 text-sm text-gray-400 font-medium">No credit card required • Join 10,000+ founders</p>
        </div>
      </section>

      {/* PRODUCT PREVIEW MOCKUP */}
      <section id="product-preview" className="py-12 px-6">
        <div className="max-w-5xl mx-auto relative group perspective">
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-400 via-indigo-500 to-purple-500 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative bg-white rounded-3xl shadow-premium border border-gray-100/50 overflow-hidden transform transition-transform duration-500 flex flex-col md:flex-row">
            
            {/* Input Side */}
            <div className="w-full md:w-5/12 bg-gray-50/50 border-r border-gray-100 p-8 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-brand-600 text-sm font-bold mb-4">
                <span className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-xs">1</span>
                Enter Your Idea
              </div>
              <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 relative mb-4">
                <p className="text-gray-900 font-medium text-lg leading-relaxed">
                  "An app for indie creators to automatically convert their long-form videos into viral short-form clips using AI."
                </p>
                <div className="absolute -right-3 -bottom-3 bg-brand-500 text-white p-2 rounded-lg shadow-lg">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-brand-500 w-full animate-pulse"></div>
              </div>
              <p className="text-xs text-center text-gray-400 mt-3 font-medium">AI is generating business model...</p>
            </div>

            {/* Output Side */}
            <div className="w-full md:w-7/12 bg-white p-8">
              <div className="inline-flex items-center gap-2 text-emerald-600 text-sm font-bold mb-6">
                <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">2</span>
                Execution Ready
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-brand-50 text-brand-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">SaaS & Media</span>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-emerald-100">Difficulty: Medium</span>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900">CreatorFlow AI</h3>
                  <p className="text-gray-500 text-sm mt-1">Automated multi-platform content repurposing engine.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Tech Stack</p>
                    <p className="text-sm font-medium text-gray-900">React, Node.js, FFmpeg, OpenAI API</p>
                  </div>
                  <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Monetization</p>
                    <p className="text-sm font-medium text-gray-900">Freemium ($15/mo Pro)</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">How It Works</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">From a loose idea to a fully structured business model in three simple steps.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gray-100 -z-10"></div>
            
            <div className="text-center relative">
              <div className="w-20 h-20 mx-auto bg-white border border-gray-100 shadow-premium rounded-2xl flex items-center justify-center mb-6 transform hover:-translate-y-1 transition-transform">
                <span className="text-3xl font-black text-brand-600 bg-brand-50 w-12 h-12 rounded-xl flex items-center justify-center">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Enter Your Idea</h3>
              <p className="text-gray-500 leading-relaxed">Type a sentence or two about the problem you want to solve or the industry you want to disrupt.</p>
            </div>
            
            <div className="text-center relative">
              <div className="w-20 h-20 mx-auto bg-white border border-gray-100 shadow-premium rounded-2xl flex items-center justify-center mb-6 transform hover:-translate-y-1 transition-transform">
                <span className="text-3xl font-black text-indigo-600 bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Generation</h3>
              <p className="text-gray-500 leading-relaxed">Our advanced models analyze the market and instantly generate your features, pricing, and tech stack.</p>
            </div>
            
            <div className="text-center relative">
              <div className="w-20 h-20 mx-auto bg-white border border-gray-100 shadow-premium rounded-2xl flex items-center justify-center mb-6 transform hover:-translate-y-1 transition-transform">
                <span className="text-3xl font-black text-purple-600 bg-purple-50 w-12 h-12 rounded-xl flex items-center justify-center">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Launch & Scale</h3>
              <p className="text-gray-500 leading-relaxed">Export your structured business plan and start building immediately with a clear roadmap.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Everything You Need to Start</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">We provide the blueprint so you can focus on building the product.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Zap} 
              title="AI Idea Generator" 
              desc="Turn vague concepts into sharp, execution-ready startup pitches in seconds."
              color="text-yellow-500"
              bg="bg-yellow-50"
            />
            <FeatureCard 
              icon={Target} 
              title="Deep Business Analysis" 
              desc="Identify your exact target audience, problem space, and the perfect solution."
              color="text-emerald-500"
              bg="bg-emerald-50"
            />
            <FeatureCard 
              icon={TrendingUp} 
              title="Monetization Strategy" 
              desc="Get detailed pricing tiers, business models, and realistic revenue projections."
              color="text-blue-500"
              bg="bg-blue-50"
            />
            <FeatureCard 
              icon={Cpu} 
              title="Tech Stack Recommendations" 
              desc="Discover the exact APIs, frameworks, and databases needed to build your MVP."
              color="text-purple-500"
              bg="bg-purple-50"
            />
            <FeatureCard 
              icon={BarChart3} 
              title="Market Insights" 
              desc="Understand your Total Addressable Market (TAM) and identify key competitors."
              color="text-rose-500"
              bg="bg-rose-50"
            />
            <FeatureCard 
              icon={Layout} 
              title="Save & Manage" 
              desc="Store all your generated startups in a clean dashboard to reference later."
              color="text-brand-500"
              bg="bg-brand-50"
            />
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="py-24 px-6 bg-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 relative">
            <div className="absolute inset-0 bg-brand-100 rounded-full blur-3xl opacity-50 transform -translate-x-1/2"></div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
                Stop planning.<br />Start building faster.
              </h2>
              <div className="space-y-6">
                <BenefitRow text="Save 10+ hours per week on market research" />
                <BenefitRow text="Generate complete technical architecture in seconds" />
                <BenefitRow text="Get clear, actionable monetization strategies" />
                <BenefitRow text="Validate ideas before writing a single line of code" />
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <div className="bg-gray-900 rounded-3xl p-8 md:p-12 text-white shadow-premium relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
               <Quote className="w-10 h-10 text-brand-500 mb-6 opacity-80" />
               <p className="text-xl md:text-2xl font-medium leading-relaxed mb-8 relative z-10 text-gray-100">
                 "Instead of spending three weeks doing market research and defining a feature set, I got a full technical spec and pricing strategy in 30 seconds. It gave me exactly what I needed to start coding."
               </p>
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center font-bold text-lg">SJ</div>
                 <div>
                   <p className="font-bold text-white">Sarah Jenkins</p>
                   <p className="text-sm text-gray-400">Indie Hacker</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Simple, Transparent Pricing</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Start for free, upgrade when you need more power.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-3xl p-8 shadow-subtle border border-gray-100 flex flex-col hover:shadow-premium-hover hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
              <p className="text-gray-500 text-sm mb-6">Perfect for testing the waters.</p>
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-gray-900">$0</span>
                <span className="text-gray-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <PricingFeature text="3 Startup Generations" />
                <PricingFeature text="Basic Business Plans" />
                <PricingFeature text="Community Support" />
              </ul>
              <Link to="/register" className="w-full py-3 rounded-xl font-bold text-center border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                Get Started
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-3xl p-8 shadow-premium border-2 border-brand-500 flex flex-col relative transform md:-translate-y-4 hover:shadow-premium-hover transition-all duration-300">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-brand-500 to-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm">
                Most Popular
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
              <p className="text-gray-500 text-sm mb-6">For serious founders and indie hackers.</p>
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-gray-900">$19</span>
                <span className="text-gray-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <PricingFeature text="Unlimited Generations" />
                <PricingFeature text="Deep Tech Stack Specs" />
                <PricingFeature text="Advanced Financial Models" />
                <PricingFeature text="Export to Notion/PDF" />
                <PricingFeature text="Priority Email Support" />
              </ul>
              <Link to="/register" className="w-full py-3 rounded-xl font-bold text-center gradient-bg shadow-md shadow-brand-500/20 hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all">
                Upgrade to Pro
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-3xl p-8 shadow-subtle border border-gray-100 flex flex-col hover:shadow-premium-hover hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Agency</h3>
              <p className="text-gray-500 text-sm mb-6">For venture studios and agencies.</p>
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-gray-900">$99</span>
                <span className="text-gray-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <PricingFeature text="Everything in Pro" />
                <PricingFeature text="White-label Reports" />
                <PricingFeature text="Custom API Access" />
                <PricingFeature text="Dedicated Account Manager" />
              </ul>
              <Link to="/register" className="w-full py-3 rounded-xl font-bold text-center border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 relative overflow-hidden bg-gray-900">
        {/* Subtle glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/40 via-gray-900 to-gray-900"></div>
        {/* Abstract pattern */}
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNHYtNGgtMnY0aC00djJoNHY0aDJ2LTRoNHYtMmgtNHptMC0zMFYwaC0ydjRoLTR2Mmg0djRoMnYtNGg0VjRoLTR6bS0yMCAxMnYtNGgtMnY0aC00djJoNHY0aDJ2LTRoNHYtMmgtNHptMCAzMHYtNGgtMnY0aC00djJoNHY0aDJ2LTRoNHYtMmgtNHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMSIvPjwvZz48L3N2Zz4=')]"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight drop-shadow-sm">
            Start Building Your Startup Today
          </h2>
          <p className="text-xl text-white/90 font-medium mb-10 max-w-2xl mx-auto drop-shadow-sm">
            Join thousands of founders who are validating and building their products faster than ever before.
          </p>
          <Link to="/register" className="bg-white text-gray-900 hover:bg-gray-50 shadow-premium hover:shadow-premium-hover hover:-translate-y-0.5 active:scale-95 transition-all duration-200 font-bold py-4 px-8 rounded-xl inline-flex items-center justify-center gap-2 text-lg">
            Get Started Free <ChevronRight className="w-5 h-5 text-brand-500" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-brand-500 p-1.5 rounded-lg text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white">AI Startup Builder</span>
            </div>
            <p className="text-sm">Empowering the next generation of founders to build, scale, and succeed.</p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Showcase</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-gray-800 text-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <p>© 2026 AI Startup Builder. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            {/* Social Icons could go here */}
          </div>
        </div>
      </footer>
    </div>
  );
}

// Subcomponents for cleanliness
function FeatureCard({ icon: Icon, title, desc, color, bg }) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-subtle border border-gray-100 hover:shadow-premium-hover hover:-translate-y-1.5 transition-all duration-300 group">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${bg} ${color} group-hover:scale-110 transition-transform`}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function BenefitRow({ text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1">
        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      </div>
      <span className="text-lg text-gray-700 font-medium">{text}</span>
    </div>
  );
}

function PricingFeature({ text }) {
  return (
    <li className="flex items-center gap-2 text-sm text-gray-700">
      <CheckCircle2 className="w-4 h-4 text-brand-500" /> {text}
    </li>
  );
}

// Quick Lucide shim for missing Quote icon if not imported properly
function Quote(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
    </svg>
  );
}
