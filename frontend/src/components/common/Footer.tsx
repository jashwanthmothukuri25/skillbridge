import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B1020] text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1E293B] to-[#4F7CFF] flex items-center justify-center text-white">
                <Layers className="w-4 h-4 text-blue-300" />
              </div>
              <span className="font-bold text-lg tracking-tight">SkillBridge</span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              Bridge the Gap Between College and Industry. Connecting ambitious college students with
              verified engineers for 1-on-1 career acceleration.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Verified Industry Mentors</span>
            </div>
          </div>

          {/* Links: For Students */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              For Students
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/mentors" className="hover:text-white transition-colors">
                  Find a Mentor
                </Link>
              </li>
              <li>
                <Link to="/mentors?skill=DSA" className="hover:text-white transition-colors">
                  DSA & Algorithms
                </Link>
              </li>
              <li>
                <Link to="/mentors?skill=System Design" className="hover:text-white transition-colors">
                  System Design
                </Link>
              </li>
              <li>
                <Link to="/mentors?skill=Java" className="hover:text-white transition-colors">
                  Full Stack Java
                </Link>
              </li>
              <li>
                <Link to="/student" className="hover:text-white transition-colors">
                  My Sessions
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: For Professionals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              For Professionals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/signup?role=mentor" className="hover:text-white transition-colors">
                  Become a Mentor
                </Link>
              </li>
              <li>
                <Link to="/mentor" className="hover:text-white transition-colors">
                  Mentor Studio
                </Link>
              </li>
              <li>
                <Link to="/mentor" className="hover:text-white transition-colors">
                  Package Builder
                </Link>
              </li>
              <li>
                <Link to="/mentor" className="hover:text-white transition-colors">
                  Availability Calendar
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <span className="text-gray-500 cursor-not-allowed">
                  Privacy & Terms
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 mt-12 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 SkillBridge Technologies. Bridge the Gap Between College and Industry.</p>
          <div className="flex items-center gap-1">
            <span>Crafted for engineers with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
