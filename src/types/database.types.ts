export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          role: 'admin' | 'coach' | 'player';
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          phone?: string | null;
          role?: 'admin' | 'coach' | 'player';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string | null;
          role?: 'admin' | 'coach' | 'player';
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      players: {
        Row: {
          id: string;
          user_id: string | null;
          full_name: string;
          phone: string;
          email: string | null;
          skill_level: 'beginner' | 'intermediate' | 'advanced';
          guardian_name: string | null;
          guardian_phone: string | null;
          total_sessions: number;
          internal_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          full_name: string;
          phone: string;
          email?: string | null;
          skill_level?: 'beginner' | 'intermediate' | 'advanced';
          guardian_name?: string | null;
          guardian_phone?: string | null;
          total_sessions?: number;
          internal_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          full_name?: string;
          phone?: string;
          email?: string | null;
          skill_level?: 'beginner' | 'intermediate' | 'advanced';
          guardian_name?: string | null;
          guardian_phone?: string | null;
          total_sessions?: number;
          internal_notes?: string | null;
          updated_at?: string;
        };
      };
      service_types: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          duration_minutes: number;
          price_lkr: number;
          max_capacity: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          duration_minutes?: number;
          price_lkr: number;
          max_capacity?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          duration_minutes?: number;
          price_lkr?: number;
          max_capacity?: number;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          booking_reference: string;
          player_id: string | null;
          service_id: string | null;
          user_id: string | null;
          booking_type: 'personal-coaching' | 'group-training' | 'table-rental';
          booking_date: string;
          start_time: string;
          end_time: string;
          duration_minutes: number;
          table_number: number;
          price_snapshot: number;
          total_amount: number;
          status: 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'completed';
          payment_status: 'unpaid' | 'paid' | 'refunded';
          customer_name: string;
          customer_phone: string;
          customer_email: string | null;
          skill_level: string | null;
          guardian_name: string | null;
          guardian_phone: string | null;
          participants_count: number;
          pool_table_complimentary: boolean;
          notes: string | null;
          admin_notes: string | null;
          approval_timestamp: string | null;
          approved_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_reference: string;
          player_id?: string | null;
          service_id?: string | null;
          user_id?: string | null;
          booking_type: 'personal-coaching' | 'group-training' | 'table-rental';
          booking_date: string;
          start_time: string;
          end_time: string;
          duration_minutes?: number;
          table_number?: number;
          price_snapshot: number;
          total_amount: number;
          status?: 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'completed';
          payment_status?: 'unpaid' | 'paid' | 'refunded';
          customer_name: string;
          customer_phone: string;
          customer_email?: string | null;
          skill_level?: string | null;
          guardian_name?: string | null;
          guardian_phone?: string | null;
          participants_count?: number;
          pool_table_complimentary?: boolean;
          notes?: string | null;
          admin_notes?: string | null;
          approval_timestamp?: string | null;
          approved_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_reference?: string;
          player_id?: string | null;
          service_id?: string | null;
          user_id?: string | null;
          booking_type?: 'personal-coaching' | 'group-training' | 'table-rental';
          booking_date?: string;
          start_time?: string;
          end_time?: string;
          duration_minutes?: number;
          table_number?: number;
          price_snapshot?: number;
          total_amount?: number;
          status?: 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'completed';
          payment_status?: 'unpaid' | 'paid' | 'refunded';
          customer_name?: string;
          customer_phone?: string;
          customer_email?: string | null;
          skill_level?: string | null;
          guardian_name?: string | null;
          guardian_phone?: string | null;
          participants_count?: number;
          pool_table_complimentary?: boolean;
          notes?: string | null;
          admin_notes?: string | null;
          approval_timestamp?: string | null;
          approved_by?: string | null;
          updated_at?: string;
        };
      };
      booking_participants: {
        Row: {
          id: string;
          booking_id: string;
          participant_name: string;
          participant_phone: string | null;
          skill_level: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          participant_name: string;
          participant_phone?: string | null;
          skill_level?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          participant_name?: string;
          participant_phone?: string | null;
          skill_level?: string | null;
        };
      };
      payments: {
        Row: {
          id: string;
          booking_id: string;
          booking_reference: string;
          player_id: string | null;
          amount: number;
          currency: string;
          payment_method: 'cash' | 'bank_transfer' | 'card' | 'online';
          reference_number: string | null;
          status: 'unpaid' | 'paid' | 'refunded';
          payment_date: string | null;
          collected_by: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          booking_reference: string;
          player_id?: string | null;
          amount: number;
          currency?: string;
          payment_method?: 'cash' | 'bank_transfer' | 'card' | 'online';
          reference_number?: string | null;
          status?: 'unpaid' | 'paid' | 'refunded';
          payment_date?: string | null;
          collected_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          booking_reference?: string;
          player_id?: string | null;
          amount?: number;
          currency?: string;
          payment_method?: 'cash' | 'bank_transfer' | 'card' | 'online';
          reference_number?: string | null;
          status?: 'unpaid' | 'paid' | 'refunded';
          payment_date?: string | null;
          collected_by?: string | null;
          notes?: string | null;
        };
      };
      availability_rules: {
        Row: {
          id: string;
          day_of_week: number;
          open_time: string;
          close_time: string;
          slot_interval_minutes: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          day_of_week: number;
          open_time: string;
          close_time: string;
          slot_interval_minutes?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          day_of_week?: number;
          open_time?: string;
          close_time?: string;
          slot_interval_minutes?: number;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      blocked_slots: {
        Row: {
          id: string;
          title: string;
          reason: string | null;
          block_type: 'holiday' | 'maintenance' | 'tournament' | 'coach_unavailable' | 'private_event';
          start_date: string;
          end_date: string;
          start_time: string | null;
          end_time: string | null;
          all_day: boolean;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          reason?: string | null;
          block_type?: 'holiday' | 'maintenance' | 'tournament' | 'coach_unavailable' | 'private_event';
          start_date: string;
          end_date: string;
          start_time?: string | null;
          end_time?: string | null;
          all_day?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          reason?: string | null;
          block_type?: 'holiday' | 'maintenance' | 'tournament' | 'coach_unavailable' | 'private_event';
          start_date?: string;
          end_date?: string;
          start_time?: string | null;
          end_time?: string | null;
          all_day?: boolean;
          created_by?: string | null;
        };
      };
      academy_settings: {
        Row: {
          key: string;
          value: Json;
          description: string | null;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          description?: string | null;
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: Json;
          description?: string | null;
          updated_by?: string | null;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          recipient_email: string | null;
          recipient_phone: string | null;
          type: 'booking_request' | 'booking_approved' | 'booking_rejected' | 'booking_cancelled' | 'reminder' | 'admin_alert';
          title: string;
          message: string;
          metadata: Json;
          status: 'pending' | 'sent' | 'failed';
          sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipient_email?: string | null;
          recipient_phone?: string | null;
          type: 'booking_request' | 'booking_approved' | 'booking_rejected' | 'booking_cancelled' | 'reminder' | 'admin_alert';
          title: string;
          message: string;
          metadata?: Json;
          status?: 'pending' | 'sent' | 'failed';
          sent_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          recipient_email?: string | null;
          recipient_phone?: string | null;
          type?: 'booking_request' | 'booking_approved' | 'booking_rejected' | 'booking_cancelled' | 'reminder' | 'admin_alert';
          title?: string;
          message?: string;
          metadata?: Json;
          status?: 'pending' | 'sent' | 'failed';
          sent_at?: string | null;
        };
      };
      admin_activity_logs: {
        Row: {
          id: string;
          admin_id: string | null;
          action: string;
          target_type: string;
          target_id: string | null;
          details: Json;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_id?: string | null;
          action: string;
          target_type: string;
          target_id?: string | null;
          details?: Json;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          admin_id?: string | null;
          action?: string;
          target_type?: string;
          target_id?: string | null;
          details?: Json;
          ip_address?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
