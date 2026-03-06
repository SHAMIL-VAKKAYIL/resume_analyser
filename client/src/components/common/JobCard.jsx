import React from 'react'
import { useDispatch } from 'react-redux';
import { applyForJob } from '../../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { UPLOAD_BASE_URL } from '../../api/axios';

function JobCard({ job, appliedJobs }) {

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const applied = appliedJobs?.some(application => application.jobId?._id === job?._id);



    const handleApply = (jobId) => {
        dispatch(applyForJob(jobId));
        alert('Application submitted!');
    };


    return (

        <div
            key={job?._id}
            className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-1"
        >
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-slate-800 p-2 rounded-lg w-12 h-12 flex items-center justify-center overflow-hidden border border-slate-700">
                        {job.company?.profile?.logo ? (
                            <img
                                src={`${UPLOAD_BASE_URL}/logos/${job.company.profile.logo}`}
                                alt={job.company.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-2xl">⚡</span>
                        )}
                    </div>
                    <span className="text-cyan-400 font-medium text-sm bg-cyan-950/30 px-3 py-1 rounded-full border border-cyan-900/50">
                        ${job?.salary}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {job?.title}
                </h3>

                <p className="text-slate-400 text-sm mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                    {job.company?.name || 'Unknown Company'}
                    <span className="w-2 h-2 rounded-full bg-slate-600 ml-2"></span>
                    {job?.location}
                </p>

                <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {job?.description}
                </p>
                <div className='flex gap-2 justify-end mt-auto align-items-end '>
                    {!applied && <button
                        onClick={() => handleApply(job?._id)}
                        disabled={applied}
                        className="w-full py-3 px-4 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-900/20 transition-all active:scale-95 flex justify-center items-center gap-2"
                    >
                        Apply Now
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </button>}

                    <button
                        onClick={() => navigate({
                            pathname: `/job/${job?._id}`,
                        })}
                        className="w-full py-3 px-4 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-900/20 transition-all active:scale-95 flex justify-center items-center gap-2"
                    >
                        View Details
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default JobCard
