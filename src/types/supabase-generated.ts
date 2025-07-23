export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          profile_id: string | null
          referrer: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          profile_id?: string | null
          referrer?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          profile_id?: string | null
          referrer?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      nominations: {
        Row: {
          assigned_tier: string | null
          attachment_url: string | null
          created_at: string | null
          id: string
          links: string[] | null
          nominator_email: string | null
          nominator_name: string | null
          nominee_email: string
          nominee_name: string
          pitch: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          assigned_tier?: string | null
          attachment_url?: string | null
          created_at?: string | null
          id?: string
          links?: string[] | null
          nominator_email?: string | null
          nominator_name?: string | null
          nominee_email: string
          nominee_name: string
          pitch: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          assigned_tier?: string | null
          attachment_url?: string | null
          created_at?: string | null
          id?: string
          links?: string[] | null
          nominator_email?: string | null
          nominator_name?: string | null
          nominee_email?: string
          nominee_name?: string
          pitch?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nominations_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          failure_reason: string | null
          id: string
          paid_at: string | null
          payment_method: string | null
          profile_id: string
          razorpay_order_id: string
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          status: string
          tier: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string
          failure_reason?: string | null
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          profile_id: string
          razorpay_order_id: string
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status?: string
          tier: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          failure_reason?: string | null
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          profile_id?: string
          razorpay_order_id?: string
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status?: string
          tier?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          content: Json
          created_at: string | null
          expires_at: string | null
          id: string
          is_published: boolean | null
          meta_description: string | null
          meta_title: string | null
          og_image_url: string | null
          payment_id: string | null
          payment_status: string | null
          published_at: string | null
          slug: string
          status: string
          tier: string
          updated_at: string | null
          user_id: string | null
          view_count: number | null
        }
        Insert: {
          content?: Json
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          payment_id?: string | null
          payment_status?: string | null
          published_at?: string | null
          slug: string
          status?: string
          tier: string
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          payment_id?: string | null
          payment_status?: string | null
          published_at?: string | null
          slug?: string
          status?: string
          tier?: string
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          role: string
          tier: string | null
          updated_at: string | null
          user_type: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean | null
          role?: string
          tier?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          role?: string
          tier?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
