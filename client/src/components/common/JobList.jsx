import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplicationsByUser, fetchJobs } from '../../features/user/userSlice';
import JobCard from '../../components/common/JobCard';

function JobList({ limit, jobs, status }) {

    const { applications } = useSelector(state => state.user);



    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchApplicationsByUser());
    }, [dispatch]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 9;
    const TotalJobs = jobs.length;


    // Logic for displaying current jobs
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(jobs.length / jobsPerPage);


    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            {status === 'loading' && (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                </div>
            )}
            {currentJobs && currentJobs.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {currentJobs.map((job, index) => (
                            <>
                                {limit ? (index < 6 && <JobCard appliedJobs={applications} job={job} />) : <JobCard appliedJobs={applications} job={job} />}
                            </>
                        ))}
                    </div>

                    {!limit && (<div className="flex justify-center flex-wrap gap-2 mt-10">
                        {/* Prev Button */}
                        <button
                            onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-lg border ${currentPage === 1 ? 'border-slate-800 text-slate-600 cursor-not-allowed' : 'border-slate-700 text-slate-300 hover:border-cyan-500 hover:text-cyan-400'}`}
                        >
                            Prev
                        </button>

                        {/* Page Numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(num => num === 1 || num === totalPages || (num >= currentPage - 2 && num <= currentPage + 2))
                            .map((number, index, array) => (
                                <React.Fragment key={number}>
                                    {index > 0 && array[index - 1] !== number - 1 && <span className="text-slate-600 px-2 py-2">...</span>}
                                    <button
                                        onClick={() => paginate(number)}
                                        className={`w-10 h-10 rounded-lg border transition-all duration-300 ${currentPage === number
                                            ? 'bg-cyan-500 border-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                                            : 'bg-transparent border-slate-700 text-slate-400 hover:border-cyan-500 hover:text-cyan-400'
                                            }`}
                                    >
                                        {number}
                                    </button>
                                </React.Fragment>
                            ))}

                        {/* Next Button */}
                        <button
                            onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-lg border ${currentPage === totalPages ? 'border-slate-800 text-slate-600 cursor-not-allowed' : 'border-slate-700 text-slate-300 hover:border-cyan-500 hover:text-cyan-400'}`}
                        >
                            Next
                        </button>
                    </div>)}
                </>
            ) : (
                !status === 'loading' && (
                    <div className="text-center py-20 text-slate-500">
                        <p className="text-xl">No open positions found in this sector.</p>
                    </div>
                )
            )}
        </>
    )
}

export default JobList
