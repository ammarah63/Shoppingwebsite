import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAuth, updateProfile } from "firebase/auth";

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (updatedProfile, { rejectWithValue }) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        await updateProfile(user, {
          displayName: updatedProfile.displayName,
          photoURL: updatedProfile.photoURL,
        });
        // Update other fields like phone and address in Firestore if necessary
        return {
          ...user,
          displayName: updatedProfile.displayName,
          photoURL: updatedProfile.photoURL,
          phone: updatedProfile.phone, // Assuming phone and address are stored elsewhere in Firestore
          address: updatedProfile.address,
        };
      } catch (error) {
        return rejectWithValue(error.message);
      }
    } else {
      return rejectWithValue("No user is currently signed in.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        state.loading = false;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
