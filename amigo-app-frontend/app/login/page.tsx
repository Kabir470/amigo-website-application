"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp, session, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!authLoading && session) {
      router.replace("/dashboard");
    }
  }, [session, authLoading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    if (isSignUp) {
      // Sign Up: Creates a new user in Supabase Auth
      const { error } = await signUp(email, password);
      if (error) {
        setError(error);
        setLoading(false);
      } else {
        // Since email confirmations are off, Supabase logs them in immediately.
        // The useEffect above will detect the new session and redirect them.
        setSuccessMsg("Account created! Redirecting to dashboard...");
      }
    } else {
      // Sign In: Authenticates with Supabase and receives a JWT
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
        setLoading(false);
      } else {
        // Successful login — redirect to dashboard
        router.replace("/dashboard");
      }
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Visual Side */}
      <div className="hidden lg:flex flex-1 relative flex-col justify-between p-14" 
           style={{ background: "radial-gradient(circle at 20% 15%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), var(--bg)" }}>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border" 
               style={{ background: "linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2))", borderColor: "rgba(6, 182, 212, 0.3)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="4" y="8" width="16" height="12" rx="3" stroke="#06b6d4" strokeWidth="1.7"/><circle cx="9" cy="14" r="1.4" fill="#06b6d4"/><circle cx="15" cy="14" r="1.4" fill="#06b6d4"/><path d="M12 8V4" stroke="#06b6d4" strokeWidth="1.7" strokeLinecap="round"/><circle cx="12" cy="3" r="1.3" fill="#06b6d4"/></svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Amigo</span>
        </div>

        <div className="max-w-md">
          <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Medicine delivered to the bedside — no nurse detour required.
          </h1>
          <p className="text-slate-400 text-base leading-relaxed mb-8">
            Amigo is a low-cost line-following robot fleet that carries scheduled medication from the ward station to each patient's bed, and confirms delivery with an NFC tap at the bedside.
          </p>

          <div className="relative h-48 w-full mt-8">
            <svg width="100%" height="100%" viewBox="0 0 460 220" fill="none">
              <path d="M20 190 H180 C210 190 210 160 240 160 H340 C370 160 370 60 400 60 H440" stroke="rgba(255,255,255,0.1)" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round"/>
              <path d="M20 190 H150" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="150" cy="190" r="9" fill="#0b1121" stroke="#06b6d4" strokeWidth="2"/>
              <circle cx="150" cy="190" r="3" fill="#06b6d4"/>
              
              <rect x="10" y="176" width="28" height="28" rx="6" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.3)"/>
              <rect x="422" y="42" width="30" height="30" rx="7" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.3)"/>
              <text x="10" y="168" fill="#94a3b8" fontSize="12" fontWeight="600" fontFamily="Inter">Ward Station</text>
              <text x="392" y="34" fill="#94a3b8" fontSize="12" fontWeight="600" fontFamily="Inter">Room 108</text>
            </svg>
          </div>
        </div>

        <div className="flex gap-8 text-sm text-slate-500">
          <div><b className="text-white">12</b> robots active</div>
          <div><b className="text-white">108</b> patients monitored</div>
          <div><b className="text-white">NFC</b> delivery confirmation</div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8" style={{ background: "rgba(11, 17, 33, 0.5)", backdropFilter: "blur(20px)" }}>
        <div className="glass-card w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {isSignUp ? "Create Account" : "Welcome back"}
          </h2>
          <p className="text-slate-400 text-sm mb-8">
            {isSignUp ? "Sign up for the Amigo admin panel." : "Sign in to the Amigo admin panel."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Email address</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="you@hospital.org" 
                required 
                className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)" }}
                onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Enter your password" 
                required 
                className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)" }}
                onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            {!isSignUp && (
              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-blue-500 w-4 h-4 rounded bg-slate-800" />
                  Remember me
                </label>
                <a href="#" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Forgot password?</a>
              </div>
            )}

            {error && (
              <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                {error}
              </div>
            )}

            {successMsg && (
              <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" }}>
                {successMsg}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all transform active:scale-95"
              style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)", boxShadow: "0 4px 20px rgba(59,130,246,0.3)" }}
            >
              {loading ? (isSignUp ? "Creating account..." : "Signing in...") : (isSignUp ? "Create Account" : "Sign in")}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            {isSignUp ? (
              <>Already have an account? <button onClick={() => { setIsSignUp(false); setError(""); setSuccessMsg(""); }} className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">Sign in</button></>
            ) : (
              <>Don&apos;t have an account? <button onClick={() => { setIsSignUp(true); setError(""); setSuccessMsg(""); }} className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">Sign up</button></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
