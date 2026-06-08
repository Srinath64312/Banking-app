import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Shield, Zap, Globe, TrendingUp, ChevronRight, Star } from "lucide-react";

const stats = [
  { label: "Active Customers", value: 2400000, suffix: "M+", prefix: "" },
  { label: "Countries Supported", value: 48, suffix: "+", prefix: "" },
  { label: "Transactions/Day", value: 12000000, suffix: "M+", prefix: "" },
  { label: "Customer Rating", value: 4.9, suffix: "/5", prefix: "" },
];

const features = [
  {
    icon: <Shield size={24} />,
    title: "Bank-Grade Security",
    desc: "256-bit encryption, biometric authentication, and real-time fraud detection protect your assets 24/7.",
  },
  {
    icon: <Zap size={24} />,
    title: "Instant Transfers",
    desc: "Send money globally in seconds. No hidden fees, no delays — just seamless transactions.",
  },
  {
    icon: <Globe size={24} />,
    title: "Global Coverage",
    desc: "Access your funds in 48+ countries with competitive exchange rates and zero foreign fees.",
  },
  {
    icon: <TrendingUp size={24} />,
    title: "Smart Investments",
    desc: "Grow your wealth with AI-powered investment tools, automated portfolios, and real-time insights.",
  },
];

const testimonials = [
  {
    name: "Sarah K.",
    role: "Freelance Designer",
    text: "NovaBanque transformed how I manage international payments. Sending invoices to clients worldwide is now effortless.",
    stars: 5,
  },
  {
    name: "Marcus T.",
    role: "Startup Founder",
    text: "The investment tools are incredible. My portfolio has grown 32% since I switched. Highly recommend.",
    stars: 5,
  },
  {
    name: "Lena M.",
    role: "Digital Nomad",
    text: "Zero foreign transaction fees and instant transfers. This is the only bank I'll ever need while traveling.",
    stars: 5,
  },
];

import useCountUp from "../hooks/useCountUp";
const StatCard = ({ label, value, suffix, prefix, animate }) => {
  const count = useCountUp(value, 2000, animate);
  const display = value % 1 !== 0 ? value.toFixed(1) : count.toLocaleString();
  return (
    <div className="text-center">
      <div className="font-display text-4xl font-bold gold-gradient mb-1">
        {prefix}{display}{suffix}
      </div>
      <div className="text-navy-300 text-sm">{label}</div>
    </div>
  );
};

const Home = () => {
  const [statsVisible, setStatsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setStatsVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-navy-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-navy-700/10 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(42,80,176,1) 1px, transparent 1px), linear-gradient(90deg, rgba(42,80,176,1) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-navy-200 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Trusted by 2.4M+ customers worldwide
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            Banking That
            <br />
            <span className="gold-gradient italic">Works For You</span>
          </h1>

          <p className="text-navy-200 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience the future of finance — seamless global transfers, smart investments,
            and unmatched security. All in one elegant platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="group px-8 py-4 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 font-semibold text-base hover:opacity-90 transition-all shadow-xl shadow-gold-500/25 flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-4 rounded-xl glass text-white font-medium text-base hover:bg-navy-600/40 transition-all flex items-center justify-center gap-2"
            >
              View Demo
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Floating card preview */}
          <div className="mt-20 relative max-w-sm mx-auto">
            <div className="glass-card card-shine rounded-2xl p-6 text-left shadow-2xl shadow-navy-900/50 border border-navy-600/30">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="text-navy-300 text-xs mb-1 font-mono">TOTAL BALANCE</div>
                  <div className="font-display text-3xl font-bold text-white">$48,290<span className="text-gold-400">.50</span></div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                  <span className="font-bold text-navy-900">N</span>
                </div>
              </div>
              <div className="font-mono text-navy-300 tracking-widest text-sm mb-4">
                4532 •••• •••• 7821
              </div>
              <div className="flex justify-between text-xs">
                <div>
                  <div className="text-navy-400 mb-0.5">CARD HOLDER</div>
                  <div className="text-white font-medium">Alex Morgan</div>
                </div>
                <div className="text-right">
                  <div className="text-navy-400 mb-0.5">EXPIRES</div>
                  <div className="text-white font-medium">12/28</div>
                </div>
              </div>
            </div>
            {/* Shadow card behind */}
            <div className="absolute -bottom-3 left-4 right-4 h-full glass-card rounded-2xl -z-10 opacity-40 border border-navy-600/20" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-y border-navy-700/30">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} animate={statsVisible} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-gold-400 text-sm font-mono uppercase tracking-widest mb-4">Why NovaBanque</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
            Everything you need,<br />
            <span className="gold-gradient italic">nothing you don't</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="glass-card rounded-2xl p-8 hover:border-navy-500/40 transition-all duration-300 group"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy-600 to-navy-700 flex items-center justify-center text-gold-400 mb-5 group-hover:from-gold-500/20 group-hover:to-gold-600/10 transition-all">
                {f.icon}
              </div>
              <h3 className="font-display text-xl font-semibold text-white mb-3">{f.title}</h3>
              <p className="text-navy-300 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-navy-900/50 border-y border-navy-700/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-gold-400 text-sm font-mono uppercase tracking-widest mb-4">Testimonials</div>
            <h2 className="font-display text-4xl font-bold text-white">Loved by our customers</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card rounded-2xl p-7">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={14} className="text-gold-400 fill-gold-400" />
                  ))}
                </div>
                <p className="text-navy-200 leading-relaxed mb-6 text-sm">"{t.text}"</p>
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-navy-400 text-xs">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to take control of<br />
          <span className="gold-gradient italic">your finances?</span>
        </h2>
        <p className="text-navy-300 text-lg mb-10">Join 2.4 million people who bank smarter with NovaBanque.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-10 py-4 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 font-bold text-base hover:opacity-90 transition-all shadow-xl shadow-gold-500/20"
        >
          Open Your Free Account
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-navy-700/30 py-10 text-center text-navy-400 text-sm">
        <div className="font-display text-white mb-2">Nova<span className="gold-gradient">Banque</span></div>
        <p>© 2026 NovaBanque Inc. All rights reserved. FDIC Insured.</p>
      </footer>
    </div>
  );
};

export default Home;
