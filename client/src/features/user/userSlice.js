import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';



export const fetchUserProfile = createAsyncThunk(
    'user/fetchUserProfile',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/users/profile');
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Fetch profile failed' });
        }
    }
);

// export const fetchUserById = createAsyncThunk(
//     'user/fetchUserById',
//     async (userId, { rejectWithValue }) => {
//         try {
//             const res = await api.get(`/users/profile/${userId}`);
//             return res.data;
//         } catch (err) {
//             return rejectWithValue(err.response?.data || { message: 'Fetch user failed' });
//         }
//     }
// );


// Delete job
export const deleteJob = createAsyncThunk(
    'company/deleteJob',
    async (jobId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`/users/jobs/${jobId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchUsers = createAsyncThunk(
    'user/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/users/alluser');
            return res.data.users;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Fetch user failed' });
        }
    })

export const deleteUser = createAsyncThunk(
    'user/deleteUser',
    async (userId, { rejectWithValue }) => {
        try {
            await api.delete(`/users/delete/${userId}`);
            return userId;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Delete user failed' });
        }
    })

export const updateUser = createAsyncThunk(
    'user/updateUser',
    async (
        { id, data },
        { rejectWithValue }
    ) => {


        try {
            const res = await api.put(`/users/update/${id}`,
                data,
                {
                    headers:
                        { 'Content-Type': 'multipart/form-data' }
                },
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || { message: 'Update user failed' }
            );
        }
    }
);

export const fetchJobs = createAsyncThunk(
    'user/fetchJobs',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/users/jobs');
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Fetch jobs failed' });
        }
    }
);

export const fetchJobDetails = createAsyncThunk(
    'user/fetchJobDetails',
    async (jobId, { rejectWithValue }) => {
        try {
            const res = await api.get(`/users/job/${jobId}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Fetch job details failed' });
        }
    }
)

export const applyForJob = createAsyncThunk(
    'user/applyForJob',
    async (jobId, { rejectWithValue }) => {
        try {
            const res = await api.post(`/users/apply/${jobId}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Apply for job failed' });
        }
    }
);

export const JobFiltered = createAsyncThunk(
    'user/JobFiltered',
    async (filters, { rejectWithValue }) => {


        try {
            const res = await api.get('/users/jobs', { params: filters });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Filter jobs failed' });
        }
    });

export const fetchApplicationsByUser = createAsyncThunk(
    'user/fetchApplicationsByUser',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/users/applications');
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Fetch applications failed' });
        }
    }
)

export const analyseResume = createAsyncThunk(
    'user/analyseResume',
    async (resumeFile, { rejectWithValue }) => {

        try {
            const res = await api.post('/users/analyze-resume', resumeFile, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Resume analysis failed' });
        }
    })

export const checkJobAppliedStatus = createAsyncThunk(
    'user/checkJobAppliedStatus',
    async (jobId, { rejectWithValue }) => {
        try {
            const res = await api.get(`/users/checkstatus/${jobId}`);
            return res.data;

        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Check job applied status failed' });

        }
    }
);

export const recommendJobs = createAsyncThunk(
    'user/recommendJobs',
    async (resumeFile, { rejectWithValue }) => {
        try {
            const res = await api.post('/users/recommend-jobs', resumeFile, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Recommend jobs failed' });
        }
    }
);

export const matchResume = createAsyncThunk(
    'user/matchResume',
    async ({ resume, jobDescription }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('resume', resume);
            formData.append('jobDescription', jobDescription);

            const res = await api.post('/users/match-resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Match resume failed' });
        }
    }
);

const initialState = {
    users: [],
    analysisResult: null,
    recommendations: [],
    matchResult: null,
    applied: false,
    jobs: [],
    job: null,
    currentUserProfile: null,
    applications: [],
    status: 'idle',
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearError(state) {
            state.error = null;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchUserProfile.pending, state => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentUserProfile = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchUsers.pending, state => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(user => user._id !== action.payload);
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.users = state.users.map(u =>
                    u._id || u.id === action.payload.user.id ? action.payload.user : u
                );
            })
            .addCase(fetchJobs.pending, state => {
                state.status = 'loading';
            })
            .addCase(fetchJobs.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.jobs = action.payload;
            })
            .addCase(fetchJobs.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(applyForJob.fulfilled, (state, action) => {
                // handle apply success if needed
            })

            .addCase(fetchJobDetails.pending, state => {
                state.status = 'loading';
            })
            .addCase(fetchJobDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.job = action.payload;
            })
            .addCase(fetchJobDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            .addCase(JobFiltered.pending, state => {
                state.status = 'loading';
            })
            .addCase(JobFiltered.fulfilled, (state, action) => {
                state.jobs = action.payload;
                state.status = 'succeeded';
            })
            .addCase(JobFiltered.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            })

            .addCase(fetchApplicationsByUser.pending, state => {
                state.status = 'loading';
            })
            .addCase(fetchApplicationsByUser.fulfilled, (state, action) => {
                state.applications = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchApplicationsByUser.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            })
            .addCase(analyseResume.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(analyseResume.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.analysisResult = action.payload;
            })
            .addCase(analyseResume.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            .addCase(checkJobAppliedStatus.fulfilled, (state, action) => {
                state.applied = action.payload.applied;
            })
            .addCase(checkJobAppliedStatus.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Delete job
            .addCase(deleteJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteJob.fulfilled, (state, action) => {
                state.loading = false;
                state.jobs = state.jobs.filter(job => job._id !== action.meta.arg);
            })
            .addCase(deleteJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to delete job';
            })

            .addCase(recommendJobs.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(recommendJobs.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.recommendations = action.payload.recommendations;
            })
            .addCase(recommendJobs.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            .addCase(matchResume.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(matchResume.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.matchResult = action.payload.match;
            })
            .addCase(matchResume.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })



    }
});

export const { clearError } = userSlice.actions;

export default userSlice.reducer;