import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getApplications, updateApplicationStatus } from '../../features/company/companySlice';
import { Link, useNavigate } from 'react-router-dom';

const Applications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { applications, loading, error } = useSelector((state) => state.company);

  useEffect(() => {
    dispatch(getApplications());
  }, [dispatch]);

  const handleStatusUpdate = async (applicationId, status) => {
    if (window.confirm(`Are you sure you want to ${status} this application?`)) {
      await dispatch(updateApplicationStatus({ applicationId, status }));
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-50 text-green-700';
      case 'Rejected':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-amber-50 text-amber-700';
    }
  };

  if (loading && applications.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Applications
          </h2>
          <p className="text-slate-600">Review and manage candidate applications</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Stats Summary */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4 border border-slate-200">
          <p className="text-slate-600 text-sm">
            <span className="font-semibold text-slate-900">{applications?.length || 0}</span> total applications
          </p>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-linear-to-r from-indigo-600 to-indigo-700">
                  <th className="px-6 py-4 text-sm font-semibold text-white uppercase tracking-wider">Candidate</th>
                  <th className="px-6 py-4 text-sm font-semibold text-white uppercase tracking-wider">Job Title</th>
                  <th className="px-6 py-4 text-sm font-semibold text-white uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-sm font-semibold text-white uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-white uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-sm font-semibold text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                            {app.userId?.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <span className="font-medium text-slate-900">
                            {app.userId?.name || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-600">{app.jobId?.title || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-600">{app.userId?.email || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          {app.resume ? <Link
                            to={`/resumes/${app.resume?.path}`}
                            className="inline-flex items-center px-3 py-2 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium transition-colors duration-200"
                            target="_blank"
                          >
                            View
                          </Link> : <span className="inline-flex items-center px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-400 font-medium transition-colors duration-200">N/A</span>}

                          {app.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(app._id, 'Accepted')}
                                className="inline-flex items-center px-3 py-2 rounded-md bg-green-50 text-green-700 hover:bg-green-100 font-medium transition-colors duration-200"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                                className="inline-flex items-center px-3 py-2 rounded-md bg-red-50 text-red-700 hover:bg-red-100 font-medium transition-colors duration-200"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                      No applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applications;
