import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/supabase';

type Club = Database['public']['Tables']['clubs']['Row'];
type ClubMember = Database['public']['Tables']['club_members']['Row'];

interface ClubState {
  clubs: Club[];
  myClubs: Club[];
  clubMembers: ClubMember[];
  loading: boolean;
  error: string | null;
}

const initialState: ClubState = {
  clubs: [],
  myClubs: [],
  clubMembers: [],
  loading: false,
  error: null,
};

export const fetchClubs = createAsyncThunk('clubs/fetchClubs', async () => {
  const { data, error } = await supabase
    .from('clubs')
    .select('*')
    .eq('is_active', true)
    .order('name');
  
  if (error) throw error;
  return data;
});

export const joinClub = createAsyncThunk(
  'clubs/joinClub',
  async ({ clubId, userId }: { clubId: string; userId: string }) => {
    const { data, error } = await supabase
      .from('club_members')
      .insert({
        club_id: clubId,
        user_id: userId,
        status: 'pending',
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
);

export const leaveClub = createAsyncThunk(
  'clubs/leaveClub',
  async ({ clubId, userId }: { clubId: string; userId: string }) => {
    const { error } = await supabase
      .from('club_members')
      .delete()
      .eq('club_id', clubId)
      .eq('user_id', userId);
    
    if (error) throw error;
    return { clubId, userId };
  }
);

const clubSlice = createSlice({
  name: 'clubs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClubs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClubs.fulfilled, (state, action: PayloadAction<Club[]>) => {
        state.loading = false;
        state.clubs = action.payload;
        state.error = null;
      })
      .addCase(fetchClubs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch clubs';
      })
      .addCase(joinClub.fulfilled, (state, action: PayloadAction<ClubMember>) => {
        state.clubMembers.push(action.payload);
      })
      .addCase(leaveClub.fulfilled, (state, action) => {
        state.clubMembers = state.clubMembers.filter(
          member => !(member.club_id === action.payload.clubId && member.user_id === action.payload.userId)
        );
      });
  },
});

export const { clearError } = clubSlice.actions;
export default clubSlice.reducer;