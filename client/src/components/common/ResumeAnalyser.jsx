import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { analyseResume, recommendJobs, matchResume } from '../../features/user/userSlice';
import JobList from './JobList';
import toast from 'react-hot-toast';

function ResumeAnalyser() {

    const inputRef = useRef()
    const dispatch = useDispatch()
    const { analysisResult, status, recommendations, matchResult } = useSelector(state => state.user);




    const [activeTab, setActiveTab] = useState('roast');
    const [jobDescription, setJobDescription] = useState('');
    const [file, setFile] = useState(null);
    // Removed local error state in favor of toast
    // Removed local state for matchResult, recommendations, loading as they are in Redux

    // --- Actions ---

    const handleRoast = async () => {
        if (!file) {
            toast.error('Please select a file first');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('resume', file);
            await dispatch(analyseResume(formData)).unwrap();
            toast.success('Resume analyzed successfully!');
        } catch (error) {
            toast.error(error.message || 'Error analyzing resume');

        }
    };

    const handleRecommend = async () => {
        if (!file) {
            toast.error('Please upload a resume first');
            return;
        }


        try {
            const formData = new FormData();
            formData.append('resume', file);

            await dispatch(recommendJobs(formData)).unwrap();
            toast.success('Jobs recommended!');
        } catch (err) {
            toast.error(err.message || 'Error fetching recommendations');

        }
    };

    const handleMatch = async () => {
        if (!file) {
            toast.error('Please upload a resume first');
            return;
        }
        if (!jobDescription.trim()) {
            toast.error('Please enter a job description');
            return;
        }


        try {
            await dispatch(matchResume({ resume: file, jobDescription })).unwrap();
            toast.success('Match analysis complete!');
        } catch (err) {
            toast.error(err.message || 'Error analyzing match');

        }
    };


    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        // Reset states when new file is chosen
        // setMatchResult(null); // Managed by Redux, strictly speaking we might want to allow previous result to stay or clear it via action
        // setRecommendations([]);
    }

    return (
        <div className="w-full bg-slate-900 p-20 min-h-screen">
            <div className="bg-slate-900/60 mx-auto max-w-5xl border border-slate-800 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Resume AI Powerhouse</h3>

                {/* File Upload Section */}
                <div className="mb-8">

                    <div
                        className={`w-full border-2 border-slate-700 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-950/30 hover:border-cyan-500 transition-colors ${file ? 'border-cyan-500/50 bg-cyan-900/10' : ''}`}
                        onClick={() => inputRef.current?.click()}
                    >
                        <input ref={inputRef} type="file" accept=".pdf,.docx,.doc" className="hidden" onChange={handleFileSelect} />
                        <div className="text-4xl mb-2">{file ? '📄' : '📤'}</div>
                        <div className="text-white font-medium">{file ? file.name : 'Click or drag & drop your resume'}</div>
                        <div className="text-slate-400 text-sm mt-2">PDF or DOCX — max 5MB</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-700 mb-6 font-poppins">
                    <button
                        className={`flex-1 pb-4 text-center font-medium transition-colors ${activeTab === 'roast' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'}`}
                        onClick={() => setActiveTab('roast')}
                    >
                        🔥 Resume Roast
                    </button>
                    <button
                        className={`flex-1 pb-4 text-center font-medium transition-colors ${activeTab === 'recommend' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'}`}
                        onClick={() => setActiveTab('recommend')}
                    >
                        💼 Job Recommendations
                    </button>
                    <button
                        className={`flex-1 pb-4 text-center font-medium transition-colors ${activeTab === 'match' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'}`}
                        onClick={() => setActiveTab('match')}
                    >
                        🎯 JD Match
                    </button>
                </div>

                {/* Content Area */}
                <div className="min-h-[400px]">

                    {/* --- ROAST TAB --- */}
                    {activeTab === 'roast' && (
                        <div className="animate-fade-in">
                            <div className="flex justify-center mb-6">
                                <button
                                    onClick={handleRoast}
                                    disabled={!file || status === 'loading'}
                                    className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                                >
                                    {status === 'loading' ? 'Roasting...' : '🔥 Roast My Resume'}
                                </button>
                            </div>

                            {analysisResult?.analysis?.roast && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                                            <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-1">Resume Score</h4>
                                            <div className="text-4xl font-bold text-white">{analysisResult.analysis.score?.resume_score || 0}/100</div>
                                        </div>
                                        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                                            <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-1">Verdict</h4>
                                            <div className="text-white italic">"{analysisResult.analysis.roast[0]}"</div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-950/50 rounded-xl p-6 border border-slate-800">
                                        <h4 className="text-lg font-semibold text-orange-400 mb-4">The Roast 🔥</h4>
                                        <ul className="space-y-3">
                                            {analysisResult.analysis.roast.slice(1).map((line, idx) => (
                                                <li key={idx} className="flex gap-3 text-slate-300">
                                                    <span className="text-orange-500 mt-1">💀</span>
                                                    <span>{line}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* --- RECOMMEND TAB --- */}
                    {activeTab === 'recommend' && (
                        <div className="animate-fade-in">
                            <div className="flex justify-center mb-6">
                                <button
                                    onClick={handleRecommend}
                                    disabled={!file || status === 'loading'}
                                    className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-bold shadow-lg disabled:opacity-50 transition-all"
                                >
                                    {status === 'loading' ? 'Finding Jobs...' : 'Find Matching Jobs'}
                                </button>
                            </div>

                            {recommendations && recommendations.length > 0 ? (
                                <JobList jobs={recommendations} />
                            ) : (
                                status !== 'loading' && <div className="text-center text-slate-500 mt-10">No recommendations yet. Upload a resume and click the button!</div>
                            )}
                        </div>
                    )}

                    {/* --- MATCH TAB --- */}
                    {activeTab === 'match' && (
                        <div className="animate-fade-in">
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-300 mb-2">Job Description</label>
                                <textarea
                                    className="w-full h-40 bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none"
                                    placeholder="Paste the Job Description here..."
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="flex justify-center mb-8">
                                <button
                                    onClick={handleMatch}
                                    disabled={!file || !jobDescription || status === 'loading'}
                                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-lg disabled:opacity-50 transition-all"
                                >
                                    {status === 'loading' ? 'Matching...' : 'Analyze Match'}
                                </button>
                            </div>

                            {matchResult && (
                                <div className="space-y-6">
                                    <div className="text-center mb-8">
                                        <div className="inline-flex items-center justify-center p-5  rounded-full border-4 border-indigo-500 bg-indigo-500/10 mb-4">
                                            <span className="text-4xl font-bold text-white ">{matchResult.match_percentage}%</span>
                                        </div>
                                        <h4 className="text-xl font-medium text-white">Match Score</h4>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-green-900/20 border border-green-800 rounded-xl p-5">
                                            <h5 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
                                                <span>✅</span> Matched Keywords
                                            </h5>
                                            <div className="flex flex-wrap gap-2">
                                                {matchResult.matched_keywords.length > 0 ? matchResult.matched_keywords.map(kw => (
                                                    <span key={kw} className="px-2 py-1 bg-green-900/40 text-green-300 text-xs rounded-md border border-green-800">
                                                        {kw}
                                                    </span>
                                                )) : <span className="text-slate-500 text-sm">None</span>}
                                            </div>
                                        </div>

                                        <div className="bg-red-900/20 border border-red-800 rounded-xl p-5">
                                            <h5 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
                                                <span>❌</span> Missing Keywords
                                            </h5>
                                            <div className="flex flex-wrap gap-2">
                                                {matchResult.missing_keywords.length > 0 ? matchResult.missing_keywords.map(kw => (
                                                    <span key={kw} className="px-2 py-1 bg-red-900/40 text-red-300 text-xs rounded-md border border-red-800">
                                                        {kw}
                                                    </span>
                                                )) : <span className="text-slate-500 text-sm">None</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ResumeAnalyser;
