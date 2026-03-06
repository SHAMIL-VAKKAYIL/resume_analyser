import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs, applyForJob, JobFiltered } from '../../features/user/userSlice';
import JobList from '../../components/common/JobList';

export default function JobsPage() {
    const dispatch = useDispatch();


    const { jobs, status } = useSelector(state => state.user);



    const [searchQuery, setSearchQuery] = useState('');
    const [experienceLevel, setExperienceLevel] = useState('all');
    const [isLoading, setIsLoading] = useState(false);

    // Handle search and filters
    const handleSearch = async () => {

        dispatch(JobFiltered({
            title: searchQuery,
            experience: experienceLevel !== 'all' ? experienceLevel : undefined,
        }))
    };

    // Trigger search when filters change

    const handleReset = () => {
        setSearchQuery('');
        setExperienceLevel('all');
    };

    useEffect(() => {
        setIsLoading(true);
        dispatch(JobFiltered()).then(() => setIsLoading(false));
    }, [dispatch,]);

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans pt-24 pb-20 px-6 relative overflow-hidden">

            {/* Background Effects */}
            <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="max-w-7xl mx-auto relative z-10">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-500">
                            Career Opportunities
                        </span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Browse through open positions and find your place in the future.
                    </p>
                </div>

                {/* Search Bar Section */}
                <div className="mb-12">
                    <div className="bg-linear-to-r from-slate-900/50 to-slate-900/30 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">

                        {/* Search Input Row */}
                        <div className="flex flex-col md:flex-row gap-4 md:gap-3 items-end">

                            {/* Search Input */}
                            <div className="flex-1 flex items-center px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl hover:border-slate-500/50 focus-within:border-cyan-500/50 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all duration-300">
                                <input
                                    type="text"
                                    placeholder="Search by title, company, skills..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none"
                                />
                                <svg onClick={() => handleSearch()} className="w-5 h-5 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            {/* Experience Level Filter */}
                            <div className="w-full md:w-auto min-w-fit">
                                <select
                                    value={experienceLevel}
                                    onChange={(e) => setExperienceLevel(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white hover:border-slate-500/50 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 cursor-pointer"
                                >
                                    <option value="all">All Levels</option>
                                    <option value="0+">Entry Level</option>
                                    <option value="2+">Mid Level</option>
                                    <option value="5+">Senior</option>
                                    <option value="8+">Lead</option>
                                </select>
                            </div>

                            {/* Reset Button */}
                            <button
                                onClick={handleReset}
                                disabled={isLoading}
                                className="w-full md:w-auto px-6 py-3 bg-linear-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 disabled:opacity-50 border border-slate-500/50 rounded-lg text-white font-medium transition-all duration-300 transform hover:scale-105 active:scale-95"
                            >
                                {isLoading ? 'Searching...' : 'Reset'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <JobList jobs={jobs} status={status} />
            </div>
        </div>
    )
}
