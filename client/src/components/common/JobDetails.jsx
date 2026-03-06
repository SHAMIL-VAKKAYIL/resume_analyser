import React, { useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchJobDetails, applyForJob, checkJobAppliedStatus } from '../../features/user/userSlice';
import toast from 'react-hot-toast';
import { UPLOAD_BASE_URL } from '../../api/axios';

export default function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation()

    // Assuming state structure based on previous context, user might need to adjust selector if different
    const { job, loading, applied } = useSelector(state => state.user);



    useEffect(() => {
        if (id) {
            dispatch(fetchJobDetails(id));
            dispatch(checkJobAppliedStatus(id));
        }
    }, [id, dispatch]);

    const handleApply = () => {
        if (job?._id) {
            dispatch(applyForJob(job._id));
            toast.success('Application submitted successfully!');
        }
    };

    if (loading || !job) {
        return (
            <div className='flex justify-center items-center h-screen bg-slate-950'>
                <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500'></div>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 '>
            <div className='max-w-4xl mx-auto'>
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className='mb-6 text-slate-400 hover:text-cyan-400 flex mt-10 items-center gap-2 transition-colors'
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Back to Jobs
                </button>

                <div className='bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl'>
                    {/* Header Banner */}
                    <div className='relative h-32 bg-linear-to-r from-cyan-900/20 to-blue-900/20'>
                        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"></div>
                    </div>

                    <div className='px-8 pb-8 -mt-12 relative'>
                        {/* Title Section */}
                        <div className='flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8'>
                            <div>
                                <div className='w-20 h-20 bg-slate-800 rounded-xl flex items-center justify-center shadow-lg border border-slate-700 mb-4 overflow-hidden'>
                                    {job.company?.profile?.logo ? (
                                        <img
                                            src={`${UPLOAD_BASE_URL}/logos/${job.company.profile.logo}`}
                                            alt={job.company.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-4xl">⚡</span>
                                    )}
                                </div>
                                <h1 className='text-3xl md:text-4xl font-bold text-white mb-2'>{job.title}</h1>
                                <div className='flex flex-wrap items-center gap-4 text-slate-400'>
                                    <span className='flex items-center gap-1'>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                        {job.company?.name || 'Unknown Company'}
                                    </span>
                                    <span className='w-1 h-1 bg-slate-600 rounded-full'></span>
                                    <span className='flex items-center gap-1'>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        {job.location}
                                    </span>
                                    <span className='w-1 h-1 bg-slate-600 rounded-full'></span>
                                    <span className='text-cyan-400 font-medium bg-cyan-950/30 px-3 py-0.5 rounded-full border border-cyan-900/50'>
                                        ${job.salary}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleApply}
                                disabled={applied}
                                className={`w-full md:w-auto py-3 px-8 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-900/20 transition-all hover:scale-105 active:scale-95 flex justify-center items-center gap-2 ${applied ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {applied ? 'Already Applied' : 'Apply Now'}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </button>
                        </div>

                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                            {/* Main Content */}
                            <div className='lg:col-span-2 space-y-8'>
                                <section>
                                    <h2 className='text-xl font-semibold text-white mb-4 flex items-center gap-2'>
                                        <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                                        Job Description
                                    </h2>
                                    <div className='text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-800/50 p-6 rounded-xl border border-slate-700/50'>
                                        {job.description}
                                    </div>
                                </section>
                            </div>

                            {/* Sidebar */}
                            <div className='space-y-6'>
                                <div className='bg-slate-800/50 p-6 rounded-xl border border-slate-700/50'>
                                    <h3 className='text-white font-semibold mb-4'>Job Overview</h3>
                                    <div className='space-y-4'>
                                        <div>
                                            <p className='text-slate-500 text-sm mb-1'>Experience</p>
                                            <p className='text-slate-200 font-medium'>{job.experience} Years</p>
                                        </div>
                                        <div>
                                            <p className='text-slate-500 text-sm mb-1'>Job Type</p>
                                            <p className='text-slate-200 font-medium'>{job.type}</p>
                                        </div>
                                        <div>
                                            <p className='text-slate-500 text-sm mb-1'>Status</p>
                                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${job.status === 'Open' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                                {job.status}
                                            </span>
                                        </div>
                                        <div>
                                            <p className='text-slate-500 text-sm mb-1'>Posted On</p>
                                            <p className='text-slate-200 font-medium'>
                                                {new Date(job.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className='bg-slate-800/50 p-6 rounded-xl border border-slate-700/50'>
                                    <h3 className='text-white font-semibold mb-4'>Required Skills</h3>
                                    <div className='flex flex-wrap gap-2'>
                                        {job.skills?.length > 0 ? (
                                            job.skills.map((skill, index) => (
                                                <span key={index} className='bg-slate-700 text-cyan-300 text-sm px-3 py-1.5 rounded-lg border border-slate-600'>
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <span className='text-slate-500 italic'>No specific skills listed</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}