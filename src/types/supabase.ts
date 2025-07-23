// Re-export the generated types
export * from './supabase-generated'
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
      profiles: {
        Row: {
          id: string
          user_id: string
          tier: 'rising' | 'elite' | 'legacy'
          status: 'draft' | 'published' | 'archived'
          slug: string
          data: Json
          theme_settings: Json
          payment_status: 'pending' | 'completed' | 'failed'
          payment_id?: string
          published_at?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tier: 'rising' | 'elite' | 'legacy'
          status?: 'draft' | 'published' | 'archived'
          slug: string
          data: Json
          theme_settings?: Json
          payment_status?: 'pending' | 'completed' | 'failed'
          payment_id?: string
          published_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tier?: 'rising' | 'elite' | 'legacy'
          status?: 'draft' | 'published' | 'archived'
          slug?: string
          data?: Json
          theme_settings?: Json
          payment_status?: 'pending' | 'completed' | 'failed'
          payment_id?: string
          published_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          profile_id: string
          razorpay_payment_id?: string
          razorpay_order_id?: string
          amount: number
          currency: string
          status: 'created' | 'authorized' | 'captured' | 'refunded' | 'failed'
          tier: 'rising' | 'elite' | 'legacy'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          profile_id: string
          razorpay_payment_id?: string
          razorpay_order_id?: string
          amount: number
          currency?: string
          status?: 'created' | 'authorized' | 'captured' | 'refunded' | 'failed'
          tier: 'rising' | 'elite' | 'legacy'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          profile_id?: string
          razorpay_payment_id?: string
          razorpay_order_id?: string
          amount?: number
          currency?: string
          status?: 'created' | 'authorized' | 'captured' | 'refunded' | 'failed'
          tier?: 'rising' | 'elite' | 'legacy'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'visitor' | 'applicant' | 'member' | 'admin' | 'super_admin'
      nomination_status: 'pending' | 'approved' | 'rejected'
      profile_tier: 'rising' | 'elite' | 'legacy'
      profile_status: 'draft' | 'published' | 'archived'
      payment_status: 'created' | 'authorized' | 'captured' | 'refunded' | 'failed'
    }
  }
}
