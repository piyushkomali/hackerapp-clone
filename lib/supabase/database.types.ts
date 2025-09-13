export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          phone_number: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          phone_number: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone_number?: string
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          location: string
          start_time: string
          end_time: string
          type: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          location: string
          start_time: string
          end_time: string
          type: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          location?: string
          start_time?: string
          end_time?: string
          type?: string
          created_at?: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          event_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: string
          created_at?: string
        }
      }
      check_ins: {
        Row: {
          id: string
          user_id: string
          event_id: string
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_id: string
          timestamp: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: string
          timestamp?: string
          created_at?: string
        }
      }
      raffle_tickets: {
        Row: {
          id: string
          user_id: string
          event_id: string
          check_in_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_id: string
          check_in_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: string
          check_in_id?: string
          created_at?: string
        }
      }
      otp_codes: {
        Row: {
          id: string
          phone_number: string
          code: string
          expires_at: string
          used: boolean
          created_at: string
        }
        Insert: {
          id?: string
          phone_number: string
          code: string
          expires_at: string
          used?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          phone_number?: string
          code?: string
          expires_at?: string
          used?: boolean
          created_at?: string
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
      [_ in never]: never
    }
  }
}
