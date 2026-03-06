import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, updateProfile, uploadLogo } from '../../features/company/companySlice';
import { UPLOAD_BASE_URL } from '../../api/axios';

const CompanyProfile = () => {
    const dispatch = useDispatch();
    const { profile, loading, error } = useSelector((state) => state.company);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        mobile: '',
        website: '',
        location: '',
        about: '',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [logoPreview, setLogoPreview] = useState(null);

    useEffect(() => {
        dispatch(getProfile());
    }, [dispatch]);

    useEffect(() => {
        if (profile) {
            setFormData({
                mobile: profile.mobile || '',
                website: profile.website || '',
                location: profile.location || '',
                about: profile.about || '',
            });
            if (profile.logo) {
                setLogoPreview(`${UPLOAD_BASE_URL}/logos/${profile.logo}`);
            }
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogoChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);

            const logoFormData = new FormData();
            logoFormData.append('logo', file);
            await dispatch(uploadLogo(logoFormData));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(updateProfile(formData));
        if (!result.error) {
            setIsEditing(false);
        }
    };

    if (loading && !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-slate-600 font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Banner Section */}
            <div className="h-48 md:h-64 bg-linear-to-r from-indigo-600 to-indigo-800 relative shadow-inner rounded-t-2xl">
                <div className="absolute inset-0 bg-black/5 "></div>
                <div className="max-w-7xl mx-auto px-6 h-full flex items-end relative">
                    {/* Logo Column (Overlapping) */}
                    <div className="absolute -bottom-16 left-6 md:left-12">
                        <div className="relative group w-32 h-32 md:w-40 md:h-40">
                            <div className="w-full h-full rounded-2xl overflow-hidden border-4 border-white bg-white shadow-xl flex items-center justify-center group-hover:shadow-2xl transition-all duration-300">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Company Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M21 16.5c0 .38-.21.71-.53.88l-7.97 4.44c-.31.17-.69.17-1 0L3.53 17.38c-.32-.17-.53-.5-.53-.88V7.5c0-.38.21-.71.53-.88l7.97-4.44c.31-.17.69-.17 1 0l7.97 4.44c.32.17.53.5.53.88v9z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            {isEditing && <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -bottom-2 -right-2 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition transform hover:scale-110 active:scale-95 ring-4 ring-white"
                                title="Change Logo"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleLogoChange}
                            />
                        </div>
                    </div>

                    {/* Quick Stats or Welcome line */}
                    <div className="mb-4 ml-44 md:ml-60 pb-2">
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                            {profile?.userId?.name || 'Your Company'}
                        </h1>
                        <p className="text-indigo-100 font-medium">
                            {profile?.location || 'Location Not Set'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-6 py-12 pt-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar Info */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-900">Contact Details</h3>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-indigo-600 font-medium hover:text-indigo-700 hover:underline"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Official Name</label>
                                    <p className="text-slate-900 font-medium">{profile?.userId?.name}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Email Address</label>
                                    <p className="text-slate-900 font-medium">{profile?.userId?.email}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Mobile Number</label>
                                    <p className="text-slate-900 font-medium">{profile?.mobile || '---'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Website</label>
                                    <a href={profile?.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-medium hover:underline block truncate">
                                        {profile?.website || '---'}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Status Card (Optional placeholder for more engagement) */}
                        {/* <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
                            <h4 className="text-indigo-900 font-bold mb-2">Profile Status</h4>
                            <p className="text-indigo-700 text-sm mb-4">Make sure your profile is complete to attract the best candidates!</p>
                            <div className="w-full bg-indigo-200 h-2 rounded-full">
                                <div className="bg-indigo-600 h-2 rounded-full w-3/4 shadow-sm"></div>
                            </div>
                            <p className="text-right text-xs mt-1 font-medium text-indigo-900">75% Complete</p>
                        </div> */}
                    </div>

                    {/* Main Section: Form/About */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-slate-900">
                                    {isEditing ? 'Editing Profile' : 'About Company'}
                                </h3>
                                {isEditing && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleSubmit} className="p-8">
                                {isEditing ? (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                                                <input
                                                    type="text"
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleChange}
                                                    placeholder="City, Country"
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Mobile Number</label>
                                                <input
                                                    type="text"
                                                    name="mobile"
                                                    value={formData.mobile}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Website URL</label>
                                                <input
                                                    type="url"
                                                    name="website"
                                                    value={formData.website}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Company Overview</label>
                                            <textarea
                                                name="about"
                                                value={formData.about}
                                                onChange={handleChange}
                                                rows="8"
                                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none"
                                            ></textarea>
                                        </div>
                                        <div className="flex justify-end pt-4">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="px-10 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold rounded-lg hover:shadow-lg transition shadow-md disabled:opacity-50"
                                            >
                                                {loading ? 'Updating...' : 'Save Profile Changes'}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="prose prose-slate max-w-none">
                                        <div className="whitespace-pre-wrap text-slate-600 leading-relaxed text-lg">
                                            {profile?.about || 'No company overview provided yet. Tell candidates why they should join your team!'}
                                        </div>

                                        {!profile?.about && (
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(true)}
                                                className="mt-6 inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Add Company Overview
                                            </button>
                                        )}
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyProfile;


