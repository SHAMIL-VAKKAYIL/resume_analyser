import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      return { user: res.data.user, accessToken: res.data.accessToken, }; // backend returns safe user object
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Login failed' });
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password, role = 'user' }, { rejectWithValue }) => {


    try {
      const res = await api.post('/auth/register', { name, email, password, role });
      return { user: res.data.user, accessToken: res.data.accessToken, };


    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Register failed' });
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await api.post('/auth/logout');
    return;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Logout failed' });
  }
});


export const refreshUser = createAsyncThunk(
  'auth/refreshUser',
  async (_, { rejectWithValue }) => {
    try {

      const refreshRes = await api.post('/auth/refresh');

      const me = await api.get('/me');

      return {
        user: me.data.user,
        accessToken: refreshRes.data.accessToken,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Not authenticated' });
    }
  }
);

// Optionally a dedicated fetchMe (if you want to call without refresh)
export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/me');
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Fetch me failed' });
  }
});

// export const updateUser = createAsyncThunk(
//   'user/updateUser',
//   async ({ id, name, email }, { rejectWithValue }) => {
//     console.log('id', id, 'name', name, 'email', email);


//     try {
//       const res = await api.put(`/users/update/${id}`, { name, email });
//       console.log('res.data.user', res.data.user);
//       return res.data.user;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || { message: 'Update user failed' });
//     }
//   })

const initialState = {
  user: null,
  status: 'idle',
  accessToken: null,
  error: null,
  initialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, state => {
        state.status = 'loading';
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || { message: 'Login failed' };
      })

      .addCase(register.pending, state => {
        state.status = 'loading';
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || { message: 'Register failed' };
      })

      .addCase(logout.fulfilled, state => {
        state.user = null;
        state.accessToken = null;
        state.status = 'idle';
      })

      .addCase(refreshUser.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.status = 'succeeded';
        state.initialized = true;
      })
      .addCase(refreshUser.rejected, (state, action) => {
        state.user = null;
        state.accessToken = null;
        state.status = 'failed';
        state.error = action.payload;
        state.initialized = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
      })
    // .addCase(updateUser.fulfilled, (state, action) => {
    //   if (state.user && state.user._id === action.payload._id) {
    //     state.user = action.payload;
    //   }
    // })

  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
