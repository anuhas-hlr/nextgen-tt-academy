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
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          phone?: string | null;
          role?: 'admin' | 'coach' | 'player';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string | null;
          role?: 'admin' | 'coach' | 'player';
          updated_at?: string;
        };
        Relationships: [];
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
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          service_id: string | null;
          user_id: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          table_number: number;
          booking_date: string;
          start_time: string;
          end_time: string;
          total_amount: number;
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          payment_status: 'unpaid' | 'paid' | 'refunded';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          service_id?: string | null;
          user_id?: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          table_number?: number;
          booking_date: string;
          start_time: string;
          end_time: string;
          total_amount: number;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          payment_status?: 'unpaid' | 'paid' | 'refunded';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          service_id?: string | null;
          user_id?: string | null;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          table_number?: number;
          booking_date?: string;
          start_time?: string;
          end_time?: string;
          total_amount?: number;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          payment_status?: 'unpaid' | 'paid' | 'refunded';
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      academy_settings: {
        Row: {
          key: string;
          value: Json;
          description: string | null;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          description?: string | null;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: Json;
          description?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
