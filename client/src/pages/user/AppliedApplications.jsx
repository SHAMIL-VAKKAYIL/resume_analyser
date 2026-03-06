import React from 'react'
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchApplicationsByUser } from '../../features/user/userSlice';
import { useSelector } from 'react-redux';
import { UPLOAD_BASE_URL } from '../../api/axios';

function AppliedApplications() {

    const { applications } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        dispatch(fetchApplicationsByUser()).then(() => setIsLoading(false));
    }, [dispatch]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Accepted':
                return 'bg-green-500/20 text-green-400 border-green-500/50';
            case 'Rejected':
                return 'bg-red-500/20 text-red-400 border-red-500/50';
            case 'Pending':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
            default:
                return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Accepted':
                return '✓';
            case 'Rejected':
                return '✕';
            case 'Pending':
                return '⏳';
            default:
                return '•';
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans pt-24 pb-20 px-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-500">
                            My Applications
                        </span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Track all your job applications and their current status.
                    </p>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                            <p className="text-slate-400">Loading applications...</p>
                        </div>
                    </div>
                ) : applications && applications.length > 0 ? (
                    <div className="space-y-4">
                        {applications.map((application) => (
                            <div
                                key={application._id}
                                className="bg-linear-to-r from-slate-900/50 to-slate-900/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/80 transition-all duration-300 shadow-xl hover:shadow-2xl"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                                    {/* Company Image & Basic Info */}
                                    <div className="md:col-span-1 flex flex-col items-center md:items-start">
                                        {application.jobId?.company?.profile?.logo ? (
                                            <img
                                                src={`${UPLOAD_BASE_URL}/logos/${application.jobId.company.profile.logo}`}
                                                alt="Company"
                                                className="w-20 h-20 rounded-lg object-cover border border-slate-600/50 mb-3"
                                            />
                                        ) : (
                                            <div className="w-20 h-20 rounded-lg bg-linear-to-br from-cyan-500/20 to-purple-500/20 border border-slate-600/50 flex items-center justify-center mb-3">
                                                <span className="text-2xl">🏢</span>
                                            </div>
                                        )}
                                        <p className="text-sm text-slate-400">
                                            Applied on: {new Date(application.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    {/* Job Details */}
                                    <div className="md:col-span-2 space-y-3">
                                        <div>
                                            <h3 className="text-xl font-bold text-cyan-400 mb-1">
                                                {application.jobId?.title || 'Job Title'}
                                            </h3>
                                            <p className="text-slate-400 text-sm">
                                                {application.jobId?.company?.name || 'Company Name'}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-3 py-1 bg-slate-800/50 border border-slate-600/50 rounded-full text-xs text-slate-300">
                                                📍 {application.jobId?.location || 'Location'}
                                            </span>
                                            <span className="px-3 py-1 bg-slate-800/50 border border-slate-600/50 rounded-full text-xs text-slate-300">
                                                💼 {application.jobId?.type || 'Full-time'}
                                            </span>
                                            <span className="px-3 py-1 bg-slate-800/50 border border-slate-600/50 rounded-full text-xs text-slate-300">
                                                ⭐ {application.jobId?.experience || 'N/A'} exp
                                            </span>
                                        </div>

                                        <p className="text-slate-300 text-sm line-clamp-2">
                                            {application.jobId?.description || 'No description available'}
                                        </p>
                                    </div>

                                    {/* Status & Details */}
                                    <div className="md:col-span-1 flex flex-col gap-3 items-stretch md:items-end">
                                        <div className={`px-4 py-2 rounded-lg border text-center font-semibold ${getStatusColor(application.status)}`}>
                                            <span className="mr-2">{getStatusIcon(application.status)}</span>
                                            {application.status}
                                        </div>

                                        {application.jobId?.salary && (
                                            <div className="px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-center">
                                                <p className="text-xs text-slate-400 mb-1">Salary</p>
                                                <p className="text-green-400 font-bold text-sm">
                                                    {application.jobId.salary}
                                                </p>
                                            </div>
                                        )}

                                        {application.jobId?.skills && application.jobId.skills.length > 0 && (
                                            <div className="px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg">
                                                <p className="text-xs text-slate-400 mb-2">Skills Required</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {application.jobId.skills.slice(0, 2).map((skill, idx) => (
                                                        <span key={idx} className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                    {application.jobId.skills.length > 2 && (
                                                        <span className="px-2 py-1 text-slate-400 text-xs">
                                                            +{application.jobId.skills.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-2xl font-bold text-slate-300 mb-2">No Applications Yet</h3>
                        <p className="text-slate-400">Start applying to jobs to see them here!</p>
                    </div>
                )}

                {/* Summary Stats */}
                {applications && applications.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12">
                        <div className="bg-linear-to-br from-slate-900/50 to-slate-900/30 border border-slate-700/50 rounded-lg p-4 text-center">
                            <p className="text-slate-400 text-sm mb-2">Total Applications</p>
                            <p className="text-3xl font-bold text-cyan-400">{applications.length}</p>
                        </div>
                        <div className="bg-linear-to-br from-slate-900/50 to-slate-900/30 border border-slate-700/50 rounded-lg p-4 text-center">
                            <p className="text-slate-400 text-sm mb-2">Accepted</p>
                            <p className="text-3xl font-bold text-green-400">{applications.filter(a => a.status === 'Accepted').length}</p>
                        </div>
                        <div className="bg-linear-to-br from-slate-900/50 to-slate-900/30 border border-slate-700/50 rounded-lg p-4 text-center">
                            <p className="text-slate-400 text-sm mb-2">Pending</p>
                            <p className="text-3xl font-bold text-yellow-400">{applications.filter(a => a.status === 'Pending').length}</p>
                        </div>
                        <div className="bg-linear-to-br from-slate-900/50 to-slate-900/30 border border-slate-700/50 rounded-lg p-4 text-center">
                            <p className="text-slate-400 text-sm mb-2">Rejected</p>
                            <p className="text-3xl font-bold text-red-400">{applications.filter(a => a.status === 'Rejected').length}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AppliedApplications
