import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { Link, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Login failed');
    }
  }, [error]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    const resultAction = await dispatch(login(form));
    if (login.fulfilled.match(resultAction)) {
      toast.success('Logged in successfully!');
      navigate(user.role === 'admin' ? "/admin" : user.role === 'company' ? "/company" : "/");
    }
  }

  if (user) return <Navigate to={user.role === 'admin' ? "/admin" : user.role === 'company' ? "/company" : "/"} replace />;

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden">
      {/* Visual Side Panel (Desktop Only) */}
      <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 items-center justify-center p-12 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500 rounded-full blur-[120px] animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 w-full max-w-lg">
          <div className="mb-10">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-5xl font-extrabold text-white leading-tight mb-4 tracking-tighter">
              Discover your next <span className="text-blue-300">career milestone.</span>
            </h1>
            <p className="text-lg text-blue-100/80 font-medium leading-relaxed">
              Resume Analyzer simplifies your job hunt by matching your unique skills with the perfect industry opportunities.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {[
              { label: 'Smart Matching', sub: 'AI-driven analysis' },
              { label: 'Real-time Updates', sub: 'Instant notifications' },
            ].map((item, i) => (
              <div key={i} className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                <p className="text-white font-bold">{item.label}</p>
                <p className="text-blue-200/60 text-sm">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Side Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50/50">
        <div className="w-full max-w-[420px] space-y-10">
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="md:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-200">
              <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Welcome back</h2>
            <p className="text-slate-500 font-medium">Please enter your details to sign in.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-bold text-slate-700 ml-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all shadow-sm placeholder:text-slate-300"
                placeholder="name@company.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label htmlFor="password" className="block text-sm font-bold text-slate-700">
                  Password
                </label>
                {/* <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700">Forgot?</a> */}
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all shadow-sm placeholder:text-slate-300"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-black disabled:bg-slate-400 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center"
            >
              {loading ? (
                <div className="flex items-center space-x-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Verifying...</span>
                </div>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <p className="text-center text-sm font-bold text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">Sign up for free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
