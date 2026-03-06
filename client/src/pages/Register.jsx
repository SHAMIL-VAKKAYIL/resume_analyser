import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../features/auth/authSlice';
import { Link, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Register() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(state => state.auth);

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'user', // default role
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleRoleChange(role) {
    setForm({ ...form, role });
  }

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Registration failed');
    }
  }, [error]);

  const passwordValidation = {
    length: form.password.length >= 8,
    hasNumber: /\d/.test(form.password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(form.password),
    match: form.password === form.confirmPassword && form.password !== '',
  };

  const isFormValid =
    form.name.trim() !== '' &&
    form.email.includes('@') &&
    passwordValidation.length &&
    passwordValidation.hasNumber &&
    passwordValidation.hasSpecial &&
    passwordValidation.match;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!passwordValidation.match) {
      toast.error('Passwords do not match');
      return;
    }
    if (!passwordValidation.length || !passwordValidation.hasNumber || !passwordValidation.hasSpecial) {
      toast.error('Please meet all password requirements');
      return;
    }

    // Remove confirmPassword before sending to API
    const { confirmPassword, ...registerData } = form;
    const resultAction = await dispatch(register(registerData));
    if (register.fulfilled.match(resultAction)) {
      toast.success('Registration successful! Welcome!');
    }
  }

  if (user) return (user.role === 'user' ? <Navigate to="/" replace /> : <Navigate to="/company" replace />);

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden">
      {/* Visual Side Panel (Desktop Only) */}
      <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-indigo-900 via-blue-900 to-blue-800 items-center justify-center p-12 overflow-hidden border-r border-slate-100">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-indigo-400 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 w-full max-w-lg">
          <div className="mb-10">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-5xl font-extrabold text-white leading-tight mb-4 tracking-tighter">
              Build your <span className="text-indigo-300">future today.</span>
            </h1>
            <p className="text-lg text-blue-100/80 font-medium leading-relaxed">
              Whether you're looking for your dream job or building a world-class team, Resume Analyzer is your partner in growth.
            </p>
          </div>

          <div className="space-y-4">
            {[
              'Comprehensive Resume Linting',
              'Advanced Keyword Matching',
              'Collaborative Hiring Tools'
            ].map((text, i) => (
              <div key={i} className="flex items-center space-x-3 text-blue-100/70 font-bold">
                <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Side Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50/50 overflow-y-auto">
        <div className="w-full max-w-[460px] space-y-8 my-8">
          {/* Mobile Header */}
          <div className="md:hidden text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-200">
              <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Create account</h2>
            <p className="text-slate-500 font-medium">Join our community of professionals.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Role Selection Cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'user', label: 'Candidate', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                { id: 'company', label: 'Company', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' }
              ].map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleRoleChange(role.id)}
                  className={`p-4 rounded-2xl border-2 transition-all text-left ${form.role === role.id
                    ? 'border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-500/10'
                    : 'border-slate-100 bg-white hover:border-slate-300'
                    }`}
                >
                  <svg className={`w-6 h-6 mb-2 ${form.role === role.id ? 'text-indigo-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={role.icon} />
                  </svg>
                  <p className={`font-bold text-sm ${form.role === role.id ? 'text-indigo-900' : 'text-slate-600'}`}>
                    {role.label}
                  </p>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-sm font-bold text-slate-700 ml-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all shadow-sm placeholder:text-slate-300"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-bold text-slate-700 ml-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all shadow-sm placeholder:text-slate-300"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-bold text-slate-700 ml-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all shadow-sm placeholder:text-slate-300"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                />

                {/* Password Requirements UI */}
                <div className="grid grid-cols-2 gap-2 mt-2 ml-1">
                  {[
                    { met: passwordValidation.length, label: 'Min 8 characters' },
                    { met: passwordValidation.hasNumber, label: 'One number' },
                    { met: passwordValidation.hasSpecial, label: 'One special char' },
                    { met: passwordValidation.match, label: 'Passwords match' },
                  ].map((req, i) => (
                    <div key={i} className={`flex items-center space-x-2 text-[11px] font-bold transition-colors ${req.met ? 'text-green-500' : 'text-slate-400'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${req.met ? 'bg-green-500' : 'bg-slate-300'}`} />
                      <span>{req.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="block text-sm font-bold text-slate-700 ml-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all shadow-sm placeholder:text-slate-300"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full bg-slate-900 hover:bg-black disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center"
            >
              {loading ? (
                <div className="flex items-center space-x-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating account...</span>
                </div>
              ) : (
                <span>Get started</span>
              )}
            </button>
          </form>

          <p className="text-center text-sm font-bold text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );

}
