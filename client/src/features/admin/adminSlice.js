import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';



// Delete user
export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete company
export const deleteCompany = createAsyncThunk(
  'admin/deleteCompany',
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/admin/companies/${companyId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getCompanies = createAsyncThunk(
  "company/getCompanies",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/admin/companies");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch companies"
      );
    }
  }
);

// Add job
// export const addJob = createAsyncThunk(
//   'admin/addJob',
//   async (jobData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post('/admin/jobs', jobData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// // Get all jobs
// export const getJobs = createAsyncThunk(
//   'admin/getJobs',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get('/admin/jobs');
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// Update job
// export const updateJob = createAsyncThunk(
//   'admin/updateJob',
//   async ({ jobId, jobData }, { rejectWithValue }) => {
//     try {
//       const response = await axios.put(`/admin/jobs/${jobId}`, jobData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// Delete job
export const deleteJob = createAsyncThunk(
  'admin/deleteJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/admin/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Admin slice
const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    jobs: [],
    companies: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete user';
      })
      // Delete company
      .addCase(deleteCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCompany.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete company';
      })
      // Get companies
      .addCase(getCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      
      .addCase(getCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(getCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch companies';
      })
      // Add job
      //   .addCase(addJob.pending, (state) => {
      //     state.loading = true;
      //     state.error = null;
      //   })
      //   .addCase(addJob.fulfilled, (state, action) => {
      //     state.loading = false;
      //     state.jobs.push(action.payload);
      //   })
      //   .addCase(addJob.rejected, (state, action) => {
      //     state.loading = false;
      //     state.error = action.payload?.message || 'Failed to add job';
      //   })
      // Get jobs
      // .addCase(getJobs.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(getJobs.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.jobs = action.payload;
      // })
      // .addCase(getJobs.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload?.message || 'Failed to fetch jobs';
      // })
      // Update job
      //   .addCase(updateJob.pending, (state) => {
      //     state.loading = true;
      //     state.error = null;
      //   })
      //   .addCase(updateJob.fulfilled, (state, action) => {
      //     state.loading = false;
      //     const index = state.jobs.findIndex(job => job._id === action.payload._id);
      //     if (index !== -1) {
      //       state.jobs[index] = action.payload;
      //     }
      //   })
      //   .addCase(updateJob.rejected, (state, action) => {
      //     state.loading = false;
      //     state.error = action.payload?.message || 'Failed to update job';
      //   })
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
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
