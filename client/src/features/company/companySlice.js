import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

// Async thunks for company actions

// Get company profile
export const getProfile = createAsyncThunk(
  'company/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/company/profile');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update company profile
export const updateProfile = createAsyncThunk(
  'company/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.put('/company/profile', profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Upload company logo
export const uploadLogo = createAsyncThunk(
  'company/uploadLogo',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.put('/company/profile/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Add job
export const addJob = createAsyncThunk(
  'company/addJob',
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/company/jobs', jobData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get company jobs
export const getJobs = createAsyncThunk(
  'company/getJobs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/company/jobs');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update job
export const updateJob = createAsyncThunk(
  'company/updateJob',
  async ({ jobId, jobData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/company/jobs/${jobId}`, jobData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete job
export const deleteJob = createAsyncThunk(
  'company/deleteJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/company/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get applications
export const getApplications = createAsyncThunk(
  'company/getApplications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/company/applications');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// Update application status
export const updateApplicationStatus = createAsyncThunk(
  'company/updateApplicationStatus',
  async ({ applicationId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/company/applications/${applicationId}/status`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  profile: null,
  jobs: [],
  applications: [],
  loading: false,
  error: null,
}

// Company slice
const companySlice = createSlice({
  name: 'company',
  initialState: initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get profile
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;

        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch profile';
      })
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update profile';
      })
      // Upload logo
      .addCase(uploadLogo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadLogo.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(uploadLogo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to upload logo';
      })
      // Add job
      .addCase(addJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.push(action.payload);
      })
      .addCase(addJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to add job';
      })
      // Get jobs
      .addCase(getJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(getJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch jobs';
      })
      // Update job
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.jobs.findIndex(job => job._id === action.payload._id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update job';
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
      // Get applications
      .addCase(getApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(getApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch applications';
      })
      // Update application status
      .addCase(updateApplicationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.applications.findIndex(app => app._id === action.payload._id);
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update application status';
      })

  },
});

export const { clearError } = companySlice.actions;
export default companySlice.reducer;
