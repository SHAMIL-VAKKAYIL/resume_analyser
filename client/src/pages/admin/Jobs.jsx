import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJobs, deleteJob } from '../../features/user/userSlice';

function Jobs() {
    const dispatch = useDispatch();
    const { jobs, status } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(fetchJobs());
    }, [dispatch]);



    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                        Jobs Management
                    </h2>
                    <p className="text-slate-600">Manage all job postings</p>
                </div>

                {/* Content */}
                {status === 'loading' ? (
                    <div className="flex items-center justify-center min-h-96">
                        <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="text-slate-600 font-medium">Loading jobs...</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-purple-600 to-purple-700">
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                                            Job Title
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                                            Company
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                                            Location
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                                            Salary
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {jobs && jobs.length > 0 ? (
                                        jobs.map(job => (
                                            <tr
                                                key={job._id}
                                                className="hover:bg-slate-50 transition-colors duration-200"
                                            >
                                                <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                                        {job.title}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {job.company?.name || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                        📍 {job.location}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-semibold text-green-600">
                                                    ${job.salary?.toLocaleString() || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <button
                                                        onClick={() => dispatch(deleteJob(job._id))}
                                                        className="inline-flex items-center px-4 py-2 rounded-md bg-red-50 text-red-700 hover:bg-red-100 font-medium transition-colors duration-200"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="px-6 py-8 text-center text-slate-500"
                                            >
                                                <p className="text-sm">No jobs found</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Stats Summary */}
                {status !== 'loading' && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg shadow p-4">
                            <p className="text-slate-600 text-sm">Total Jobs</p>
                            <p className="text-2xl font-bold text-slate-900">{jobs?.length || 0}</p>
                        </div>
                        {/* <div className="bg-white rounded-lg shadow p-4">
                            <p className="text-slate-600 text-sm">Avg. Salary</p>
                            <p className="text-2xl font-bold text-green-600">
                                ${jobs?.length > 0 ? Math.round(jobs.reduce((sum, j) => sum + (j.salary || 0), 0) / jobs.length).toLocaleString() : 0}
                            </p>
                        </div> */}
                        <div className="bg-white rounded-lg shadow p-4">
                            <p className="text-slate-600 text-sm">Companies</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {jobs?.length > 0 ? new Set(jobs.map(j => j.company?._id)).size : 0}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Jobs;
