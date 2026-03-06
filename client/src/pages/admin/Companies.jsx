import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCompanies, deleteCompany } from '../../features/admin/adminSlice';
import { updateUser } from '../../features/user/userSlice';
import toast from 'react-hot-toast';
import { UPLOAD_BASE_URL } from '../../api/axios';

function Companies() {
    const dispatch = useDispatch();
    const { companies, loading } = useSelector(state => state.admin);

    const [editingUser, setEditingUser] = useState(null);






    useEffect(() => {
        dispatch(getCompanies());
    }, [dispatch]);

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        dispatch(updateUser({ id: editingUser.userId._id || editingUser.id, data: { name: editingUser.userId.name, email: editingUser.userId.email } }));
        toast.success('Company updated successfully');
        // window.location.href('/admin/companies');
        setEditingUser(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                        Companies Management
                    </h2>
                    <p className="text-slate-600">Manage all registered companies</p>
                </div>

                {!loading && (
                    <div className="mt-6 bg-white rounded-lg shadow p-4 mb-5">
                        <p className="text-slate-600 text-sm">
                            <span className="font-semibold text-slate-900">{companies?.length || 0}</span> total companies
                        </p>
                    </div>
                )}

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center min-h-96">
                        <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="text-slate-600 font-medium">Loading companies...</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-600 to-blue-700">
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                                            Logo
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                                            Company Name
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                                            Email
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {companies && companies.length > 0 ? (
                                        companies.map(c => (
                                            <tr
                                                key={c._id}
                                                className="hover:bg-slate-50 transition-colors duration-200"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                                                        {c.logo ? (
                                                            <img
                                                                src={`${UPLOAD_BASE_URL}/logos/${c.logo}`}
                                                                alt={c.userId?.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-lg">🏢</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                                    {c?.userId?.name || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {c?.userId?.email || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-sm space-x-2">
                                                    <button
                                                        onClick={() => setEditingUser(c)}
                                                        className="inline-flex items-center px-3 py-2 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium transition-colors duration-200"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => dispatch(deleteCompany(c._id))}
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
                                                colSpan="3"
                                                className="px-6 py-8 text-center text-slate-500"
                                            >
                                                <p className="text-sm">No companies found</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {editingUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6">Update User</h3>
                            <form onSubmit={handleUpdateSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editingUser.userId.name}
                                        onChange={e => setEditingUser({ ...editingUser, userId: { ...editingUser.userId, name: e.target.value } })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={editingUser.userId.email}
                                        onChange={e => setEditingUser({ ...editingUser, userId: { ...editingUser.userId, email: e.target.value } })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                        required
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-colors duration-200"
                                    >
                                        Update
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingUser(null)}
                                        className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Stats Summary */}

            </div>
        </div>
    );
}

export default Companies;