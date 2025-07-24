import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Image upload utilities
export const uploadImage = async (file: File, userId: string, folder: string = 'marketplace'): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${folder}/${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw new Error('Failed to upload image');
  }

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  return publicUrl;
};

export const deleteImage = async (filePath: string): Promise<void> => {
  const { error } = await supabase.storage
    .from('images')
    .remove([filePath]);

  if (error) {
    console.error('Delete error:', error);
    throw new Error('Failed to delete image');
  }
};

// --- Define the types for your DB schema ---
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role:
          | 'student'
          | 'club_head'
          | 'canteen_vendor'
          | 'hostel_admin'
          | 'super_admin';
          student_id?: string;
          phone?: string;
          hostel_block?: string;
          room_number?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };

      clubs: {
        Row: {
          id: string;
          name: string;
          description: string;
          category: string;
          club_head_id: string; // ✅ You already corrected this
          member_count: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['clubs']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['clubs']['Insert']>;
      };

      club_members: {
        Row: {
          id: string;
          club_id: string;
          user_id: string;
          status: 'pending' | 'approved' | 'rejected';
          position: 'member' | 'secretary' | 'treasurer' | 'event_manager'; // ✅ NEW
          joined_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['club_members']['Row'],
          'id' | 'joined_at'
        > & {
          position?: 'member' | 'secretary' | 'treasurer' | 'event_manager'; // ✅ Optional insert
        };
        Update: Partial<Database['public']['Tables']['club_members']['Insert']>;
      };


      hostel_rooms: {
        Row: {
          id: string;
          block: string;
          room_number: string;
          capacity: number;
          occupied: number;
          is_available: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['hostel_rooms']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['hostel_rooms']['Insert']>;
      };

      hostel_complaints: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          category: 'plumbing' | 'electricity' | 'cleaning' | 'maintenance' | 'other';
          status: 'open' | 'in_progress' | 'resolved';
          priority: 'low' | 'medium' | 'high';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['hostel_complaints']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['hostel_complaints']['Insert']>;
      };

      canteen_items: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          category: string;
          is_available: boolean;
          vendor_id: string;
          image_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['canteen_items']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['canteen_items']['Insert']>;
      };

      canteen_orders: {
        Row: {
          id: string;
          user_id: string;
          items: Array<{ item_id: string; quantity: number; price: number }>;
          total_amount: number;
          delivery_type: 'pickup' | 'delivery';
          delivery_address?: string;
          status:
          | 'pending'
          | 'confirmed'
          | 'preparing'
          | 'ready'
          | 'delivered'
          | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['canteen_orders']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['canteen_orders']['Insert']>;
      };

      marketplace_items: {
        Row: {
          id: string;
          seller_id: string;
          title: string;
          description: string;
          price: number;
          category: string;
          condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
          images: string[];
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['marketplace_items']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['marketplace_items']['Insert']>;
      };
    };
  };
};
