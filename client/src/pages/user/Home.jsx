import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import JobList from '../../components/common/JobList';
import { useDispatch } from 'react-redux';
import { fetchJobs } from '../../features/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function Home() {

  const { jobs, status } = useSelector(state => state.user);
  const { user, loading, error } = useSelector(state => state.auth);

  const navigate = useNavigate();

  if (user?.role === 'admin') navigate('/admin');
  if (user?.role === 'company') navigate('/company');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);



  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500 selection:text-black">

      {/* Hero Section */}
      <section className="relative px-6 py-4 md:py-32 overflow-hidden">
        {/* Background Gradients/Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-500 animate-pulse">
              Find Your Future
            </span>
            <br />
            <span className="text-slate-200">Start Today</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
            Explore opportunities in a world of innovation. The next generation of careers awaits you.
          </p>
        </div>
      </section>
      <main className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex justify-between items-end mb-10 border-b border-slate-800 pb-4">
          <h2 className="text-3xl font-bold text-white relative">
            Available Positions
            <span className="absolute -bottom-4 left-0 w-20 h-1 bg-cyan-500 rounded-full"></span>
          </h2>
          <span className="text-slate-500 text-sm">{jobs?.length || 0} Jobs Found</span>
        </div>
        <JobList jobs={jobs} status={status} limit={true} />
      </main>
    </div>
  );
}
