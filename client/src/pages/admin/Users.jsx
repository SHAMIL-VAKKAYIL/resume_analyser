import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, deleteUser, updateUser } from '../../features/user/userSlice';

function Users() {
  const dispatch = useDispatch();
  const { users } = useSelector(state => state.user);
  const [editingUser, setEditingUser] = useState(null);



  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUser({ id: editingUser._id || editingUser.id, data: { name: editingUser.name, email: editingUser.email } }));
    setEditingUser(null);
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'company':
        return 'bg-blue-50 text-blue-700';
      case 'user':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-slate-50 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Users Management
          </h2>
          <p className="text-slate-600">Manage all registered users</p>
        </div>

        {users && users.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow p-4 mb-5">
            <p className="text-slate-600 text-sm">
              <span className="font-semibold text-slate-900">{users?.length || 0}</span> total users
            </p>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-linear-to-r from-indigo-600 to-indigo-700">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users && users.length > 0 ? (
                  users.map(u => (
                    <tr key={u._id || u.id} className="hover:bg-slate-50 transition-colors duration-200">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 font-semibold text-sm">
                              {u.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          {u.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{u.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(u.role)}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <button
                          onClick={() => setEditingUser(u)}
                          className="inline-flex items-center px-3 py-2 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => dispatch(deleteUser(u._id))}
                          className="inline-flex items-center px-3 py-2 rounded-md bg-red-50 text-red-700 hover:bg-red-100 font-medium transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                      <p className="text-sm">No users found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* <div className="bg-white rounded-lg shadow p-4">
            <p className="text-slate-600 text-sm">Companies</p>
            <p className="text-2xl font-bold text-blue-600">{users?.filter(u => u.role === 'company').length || 0}</p>
          </div> */}
        </div>
      </div>

      {/* Edit Modal */}
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
                  value={editingUser.name}
                  onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
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
                  value={editingUser.email}
                  onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
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
    </div>
  );
}

export default Users;
