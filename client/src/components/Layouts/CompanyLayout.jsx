import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import { useDispatch } from 'react-redux';

function CompanyLayout() {
    const { pathname } = useLocation()
    const dispatch = useDispatch();

    const navItems = [
        { name: "Dashboard", path: "/company" },
        { name: "Applications", path: "/company/applications" },
        { name: "Jobs", path: "/company/jobs" },
        { name: "profile", path: "/company/profile" }
    ];

    return (
        <div className="min-h-dvh flex bg-gray-100 p-3">

            {/* Sidebar */}
            <aside className="w-64">
                <div className='fixed min-h-[97vh] w-64 bg-white border rounded-2xl border-gray-200 px-4 py-6'>

                    <h2 className="text-lg font-bold text-gray-900 mb-8 text-center">
                        Dashboard
                    </h2>

                    <nav className="space-y-2 ">
                        {navItems.map((item) => {
                            const isActive = pathname == item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
                  ${isActive
                                            ? "bg-gray-900 text-white shadow"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                        }
                `}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <button
                        onClick={() => dispatch(logout())}
                        className="mt-10 bg-red-700 w-full  px-4 py-2 text-sm font-medium text-white text-center hover:bg-red-900 rounded-md"
                    >
                        Logout
                    </button>
                </div>

            </aside>

            {/* Main Content */}
            <main className="flex-1 px-5 rounded-2xl">
                <Outlet />
            </main>
        </div>
    )
}

export default CompanyLayout
