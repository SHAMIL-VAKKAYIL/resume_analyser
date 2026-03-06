import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, fetchUserProfile } from '../../features/user/userSlice';
import { logout } from '../../features/auth/authSlice';
import { Link } from 'react-router-dom';
import { UPLOAD_BASE_URL } from '../../api/axios';

export default function Profile() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { currentUserProfile } = useSelector((state) => state.user);




    const [form, setForm] = useState({
        name: currentUserProfile?.user?.name || '',
        email: currentUserProfile?.user?.email || '',
        skills: [],
        experience: '',
        about: '',
        resume: null,
    });

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    useEffect(() => {
        if (currentUserProfile) {
            setForm({
                name: currentUserProfile.user?.name || '',
                email: currentUserProfile.user?.email || '',
                skills: currentUserProfile.profile?.skills || [],
                experience: currentUserProfile.profile?.experience || '',
                about: currentUserProfile.profile?.about || '',
                // resume: currentUserProfile.profile?.resume.resume || null,
            });
        }
    }, [currentUserProfile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'skills') {
            // Handle skills as array - split by comma and trim
            const skillsArray = value.split(',').map(s => s.trim()).filter(s => s !== ' ');
            setForm({ ...form, skills: skillsArray });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleResumeChange = (e) => {
        setForm({ ...form, resume: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append("name", form.name);
        formData.append("skills", JSON.stringify(form.skills));
        formData.append("experience", form.experience);
        formData.append("about", form.about);

        if (form.resume) {
            formData.append("resume", form.resume);
        }

        dispatch(updateUser({
            id: currentUserProfile.user._id,
            data: formData
        }));
        alert('Profile update requested!');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans overflow-hidden relative py-20 px-6">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-125 h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-2xl mx-auto relative z-10">
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl shadow-cyan-900/20">

                    <div className="text-center mb-10">
                        <div className="inline-block p-4 rounded-full bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 mb-4 border border-white/5">
                            <span className="text-4xl">👤</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                            My Profile
                        </h1>
                        <p className="text-slate-400 mt-2">Manage your personal information and settings</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-sm font-medium text-slate-400 mb-2 group-focus-within:text-cyan-400 transition-colors">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                />
                            </div>
                            <div className="group">
                                <label className="block text-sm font-medium text-slate-400 mb-2 group-focus-within:text-cyan-400 transition-colors">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950/50 border border-slate-700 text-slate-400 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all cursor-not-allowed"
                                    disabled
                                />
                            </div>
                        </div>

                        {/* Skills Section */}
                        <div className="group">
                            <label className="block text-sm font-medium text-slate-300 mb-3 group-focus-within:text-cyan-400 transition-colors flex items-center gap-2">
                                <span className="text-lg">🎯</span> Skills (comma separated)
                            </label>
                            <input
                                type="text"
                                name="skills"
                                value={form.skills}
                                onChange={handleChange}
                                placeholder="e.g. React, Node.js, UI/UX, Python"
                                className="w-full bg-slate-950/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                            />
                            {/* Skills Display */}
                            {form.skills && form.skills.length > 0 && (
                                <div className="mt-4 p-4 bg-slate-900/40 rounded-lg border border-slate-700/50">
                                    <p className="text-xs text-slate-400 mb-3">Your Skills:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {form.skills.map((skill, idx) => (
                                            skill && (
                                                <span key={idx} className="px-3 py-1.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-full text-xs text-cyan-300 font-medium">
                                                    {skill}
                                                </span>
                                            )
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="group">
                            <label className="block text-sm font-medium text-slate-400 mb-2 group-focus-within:text-cyan-400 transition-colors">Experience (years)</label>
                            <input
                                type="number"
                                name="experience"
                                value={form.experience}
                                onChange={handleChange}
                                className="w-full bg-slate-950/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                            />
                        </div>

                        <div className="group">
                            <label className="block text-sm font-medium text-slate-300 mb-2 group-focus-within:text-cyan-400 transition-colors">About Me</label>
                            <textarea
                                name="about"
                                value={form.about}
                                onChange={handleChange}
                                placeholder="Tell us about yourself, your professional background, and career goals..."
                                rows="4"
                                className="w-full bg-slate-950/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
                            />
                        </div>

                        {/* Resume Upload Section */}
                        <div className="group">
                            <label className="block text-sm font-medium text-slate-300 mb-3 group-focus-within:text-cyan-400 transition-colors flex items-center gap-2">
                                <span className="text-lg">📄</span> Upload Resume (PDF)
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    name="resume"
                                    accept=".pdf, .docx"
                                    onChange={handleResumeChange}
                                    className="hidden"
                                    id="resume-upload"
                                />
                                <label
                                    htmlFor="resume-upload"
                                    className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:border-cyan-500 hover:bg-slate-950/70 transition-all group/upload"
                                >
                                    <div className="text-center">
                                        <div className="text-4xl mb-2">📤</div>
                                        <p className="text-white font-medium">
                                            {form.resume ? (
                                                <span className="text-cyan-400">{form.resume.name}</span>
                                            ) : (
                                                <>Click to upload </>
                                            )}
                                        </p>
                                        <p className="text-slate-400 text-sm mt-1">PDF files only (Max 5MB)</p>
                                    </div>
                                </label>
                            </div>

                            {/* Resume Preview */}
                            {(form.resume || currentUserProfile?.profile?.resume?.resume) && (
                                <div className="mt-4 p-4 bg-linear-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                                                <span className="text-green-400">✓</span>
                                            </div>
                                            <div>
                                                <p className="text-white font-medium text-sm">
                                                    {currentUserProfile?.profile?.resume?.resume || 'Resume uploaded'}
                                                </p>
                                                {/* <p className="text-slate-400 text-xs">Ready for analysis</p> */}
                                            </div>
                                        </div>
                                        <Link to={`${UPLOAD_BASE_URL}/resumes/${currentUserProfile?.profile?.resume?.path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                                        >
                                            View
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-900/30 transition-all active:scale-95 transform hover:-translate-y-1"
                        >
                            Update Profile
                        </button>
                    </form>

                    {/* Logout Section */}
                    <div className="mt-12 pt-8 border-t border-slate-800">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <h3 className="text-white font-semibold">Sign Out</h3>
                                <p className="text-slate-500 text-sm">Securely log out of your account.</p>
                            </div>
                            <button
                                onClick={() => dispatch(logout())}
                                className="px-6 py-2.5 border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl font-medium transition-all duration-300"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
