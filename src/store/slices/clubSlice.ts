import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/supabase';

type Club = Database['public']['Tables']['clubs']['Row'];
type ClubMember = Database['public']['Tables']['club_members']['Row'] & {
  position: 'member' | 'secretary' | 'treasurer' | 'event_manager';
};
type Profile = Database['public']['Tables']['profiles']['Row'];

interface ClubMemberWithProfile extends ClubMember {
  profile: Profile;
}

interface ClubState {
  clubs: Club[];
  myClubs: Club[];
  clubMembers: ClubMemberWithProfile[];
  membershipRequests: ClubMemberWithProfile[];
  loading: boolean;
  error: string | null;
}

const initialState: ClubState = {
  clubs: [],
  myClubs: [],
  clubMembers: [],
  membershipRequests: [],
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

export const fetchClubMembers = createAsyncThunk(
  'clubs/fetchClubMembers',
  async (clubId: string) => {
    const { data, error } = await supabase
      .from('club_members')
      .select(`
        *,
        profiles:profiles!club_members_user_id_fkey(*)
      `)
      .eq('club_id', clubId)
      .eq('status', 'approved');

    if (error) throw error;
    return data.map((row) => ({
      ...row,
      profile: row.profiles,
    })) as ClubMemberWithProfile[];
  }
);

export const fetchMembershipRequests = createAsyncThunk(
  'clubs/fetchMembershipRequests',
  async (clubId: string) => {
    const { data, error } = await supabase
      .from('club_members')
      .select(`
        *,
        profiles:profiles!club_members_user_id_fkey(*)
      `)
      .eq('club_id', clubId)
      .eq('status', 'pending');

    if (error) throw error;
    return data.map((row) => ({
      ...row,
      profile: row.profiles,
    })) as ClubMemberWithProfile[];
  }
);


export const updateMembershipStatus = createAsyncThunk(
  'clubs/updateMembershipStatus',
  async ({
    requestId,
    status,
    position,
  }: {
    requestId: string;
    status: 'approved' | 'rejected';
    position?: 'member' | 'secretary' | 'treasurer' | 'event_manager';
  }) => {
    const updateData: any = { status };
    if (position) updateData.position = position;

    const { data, error } = await supabase
      .from('club_members')
      .update(updateData)
      .eq('id', requestId)
      .select(`*, profiles!user_id(*)`)
      .single();

    if (error) throw error;

    return {
      ...data,
      profile: data?.profiles,
    } as ClubMemberWithProfile;
  }
);



export const joinClub = createAsyncThunk(
  'clubs/joinClub',
  async ({ clubId, userId }: { clubId: string; userId: string }) => {
    const { data, error } = await supabase
      .from('club_members')
      .insert({
        club_id: clubId,
        user_id: userId,
        status: 'pending',
        position: 'member',
      })
      .select(`*, profiles!user_id(*)`)
      .single();

    if (error) throw error;

    return {
      ...data,
      profile: data?.profiles,
    } as ClubMemberWithProfile;
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
      // Fetch Clubs
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
      
      // Fetch Club Members
      .addCase(fetchClubMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClubMembers.fulfilled, (state, action: PayloadAction<ClubMemberWithProfile[]>) => {
        state.loading = false;
        state.clubMembers = action.payload;
        state.error = null;
      })
      .addCase(fetchClubMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch club members';
      })

      // Fetch Membership Requests
      .addCase(fetchMembershipRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembershipRequests.fulfilled, (state, action: PayloadAction<ClubMemberWithProfile[]>) => {
        state.loading = false;
        state.membershipRequests = action.payload;
        state.error = null;
      })
      .addCase(fetchMembershipRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch membership requests';
      })

      // Update Membership Status
      .addCase(updateMembershipStatus.fulfilled, (state, action: PayloadAction<ClubMemberWithProfile>) => {
        const { status } = action.payload;
        if (status === 'approved') {
          state.membershipRequests = state.membershipRequests.filter(req => req.id !== action.payload.id);
          state.clubMembers.push(action.payload);
        } else {
          state.membershipRequests = state.membershipRequests.filter(req => req.id !== action.payload.id);
        }
      })

      // Join Club
      .addCase(joinClub.fulfilled, (state, action: PayloadAction<ClubMember & { profile: Profile }>) => {
        state.membershipRequests.push(action.payload as ClubMemberWithProfile);
      })

      // Leave Club
      .addCase(leaveClub.fulfilled, (state, action) => {
        state.clubMembers = state.clubMembers.filter(
          member => !(member.club_id === action.payload.clubId && member.user_id === action.payload.userId)
        );
      });
  },
});

export const { clearError } = clubSlice.actions;
export default clubSlice.reducer;