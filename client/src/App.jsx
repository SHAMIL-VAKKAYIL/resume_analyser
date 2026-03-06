import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';

import RoleRoute from './components/protected/ProtectedRoute.jsx';

import AdminLayout from './components/Layouts/AdminLayout.jsx';
import Companies from './pages/admin/Companies.jsx';
import Jobs from './pages/admin/Jobs.jsx';
import Users from './pages/admin/Users.jsx';
import AdminPanel from './pages/admin/AdminPanel.jsx';

import CompanyLayout from './components/Layouts/CompanyLayout.jsx';
import Applications from './pages/company/Applications.jsx';
import CompanyJob from './pages/company/CompanyJob.jsx';
import CompanyPanel from './pages/company/CompanyPanel.jsx';
import CompanyProfile from './pages/company/CompanyProfile.jsx';

import Home from './pages/user/Home.jsx';
import Profile from './pages/user/Profile.jsx';
import UserLayout from './components/Layouts/UserLayout.jsx';
import JobsPage from './pages/user/JobsPage.jsx';
import JobDetails from './components/common/JobDetails.jsx';
import AppliedApplications from './pages/user/AppliedApplications.jsx';
import ResumeViewer from './components/common/ResumeViewer.jsx';
import ResumeAnalyser from './components/common/ResumeAnalyser.jsx';
import NotFound from './pages/NotFound.jsx';



const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/resumes/:filename',
    element: <ResumeViewer />,
  },
  //! user Routes
  {
    path: '/',
    element: (
      <RoleRoute roles={['user']} >
        <UserLayout />
      </RoleRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'jobs', element: <JobsPage /> },
      { path: 'job/:id', element: <JobDetails /> },
      { path: 'profile', element: <Profile /> },
      { path: 'applications', element: <AppliedApplications /> },
      { path: 'analyser', element: <ResumeAnalyser /> }
    ]
  },
  //! admin Routes
  {
    path: '/admin',
    element: (
      <RoleRoute roles={['admin']} >
        <AdminLayout />
      </RoleRoute>
    ),
    children: [
      { index: true, element: <AdminPanel /> },
      { path: 'users', element: <Users /> },
      { path: 'companies', element: <Companies /> },
      { path: 'jobs', element: <Jobs /> }
    ]
  },
  //! company Routes
  {
    path: '/company',
    element: (
      <RoleRoute roles={['company']} >
        <CompanyLayout />
      </RoleRoute>
    ),
    children: [
      { index: true, element: <CompanyPanel /> },
      { path: 'applications', element: <Applications /> },
      { path: 'jobs', element: <CompanyJob /> },
      { path: 'profile', element: <CompanyProfile /> },
    ]
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;