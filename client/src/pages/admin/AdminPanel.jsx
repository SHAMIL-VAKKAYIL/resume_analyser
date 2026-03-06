import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJobs, fetchUsers } from '../../features/user/userSlice';
import { getCompanies } from '../../features/admin/adminSlice';





export default function AdminPanel() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { users, jobs: allJobs } = useSelector(state => state.user);
  const { companies } = useSelector(state => state.admin);


  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(fetchUsers());
      dispatch(getCompanies());
      dispatch(fetchJobs());
    }
  }, [dispatch, user]);



  return (
    <div style={{ padding: 40 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard - {user?.role.toUpperCase()}</h1>
        {/* <button onClick={() => dispatch(logout())}>Logout</button> */}
      </header>
      <div style={{ marginTop: 20, marginBottom: 20 }}>

        <div style={{ padding: '20px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2>Overview</h2>
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
            <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
              <h3>Total Users</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{users.length}</p>
            </div>
            <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
              <h3>Total Companies</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{companies.length}</p>
            </div>
            <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
              <h3>Total Jobs</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{allJobs.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
