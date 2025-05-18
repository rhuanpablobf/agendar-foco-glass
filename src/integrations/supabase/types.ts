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
      appointments: {
        Row: {
          client_id: string
          company_id: string
          created_at: string | null
          date: string
          end_time: string
          id: string
          notes: string | null
          professional_id: string
          service_id: string
          status: Database["public"]["Enums"]["appointment_status"]
          updated_at: string | null
        }
        Insert: {
          client_id: string
          company_id: string
          created_at?: string | null
          date: string
          end_time: string
          id?: string
          notes?: string | null
          professional_id: string
          service_id: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          company_id?: string
          created_at?: string | null
          date?: string
          end_time?: string
          id?: string
          notes?: string | null
          professional_id?: string
          service_id?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      client_loyalty: {
        Row: {
          client_id: string
          created_at: string | null
          last_visit: string | null
          points: number
          stamps: number
          total_spent: number
          updated_at: string | null
          visits: number
        }
        Insert: {
          client_id: string
          created_at?: string | null
          last_visit?: string | null
          points?: number
          stamps?: number
          total_spent?: number
          updated_at?: string | null
          visits?: number
        }
        Update: {
          client_id?: string
          created_at?: string | null
          last_visit?: string | null
          points?: number
          stamps?: number
          total_spent?: number
          updated_at?: string | null
          visits?: number
        }
        Relationships: [
          {
            foreignKeyName: "client_loyalty_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_preferences: {
        Row: {
          client_id: string
          created_at: string | null
          id: string
          professional_id: string | null
          service_id: string | null
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          id?: string
          professional_id?: string | null
          service_id?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          id?: string
          professional_id?: string | null
          service_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_preferences_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_preferences_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_preferences_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          communication_preference:
            | Database["public"]["Enums"]["communication_preference"]
            | null
          company_id: string
          created_at: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string
          profile_id: string | null
          updated_at: string | null
        }
        Insert: {
          communication_preference?:
            | Database["public"]["Enums"]["communication_preference"]
            | null
          company_id: string
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone: string
          profile_id?: string | null
          updated_at?: string | null
        }
        Update: {
          communication_preference?:
            | Database["public"]["Enums"]["communication_preference"]
            | null
          company_id?: string
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          profile_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      combo_services: {
        Row: {
          combo_id: string
          created_at: string | null
          service_id: string
        }
        Insert: {
          combo_id: string
          created_at?: string | null
          service_id: string
        }
        Update: {
          combo_id?: string
          created_at?: string | null
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "combo_services_combo_id_fkey"
            columns: ["combo_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "combo_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          appointment_id: string | null
          base_amount: number
          commission_amount: number
          company_id: string
          created_at: string | null
          date: string
          id: string
          is_paid: boolean
          notes: string | null
          paid_date: string | null
          percentage: number
          professional_id: string
          service_id: string
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_id?: string | null
          base_amount: number
          commission_amount: number
          company_id: string
          created_at?: string | null
          date: string
          id?: string
          is_paid?: boolean
          notes?: string | null
          paid_date?: string | null
          percentage: number
          professional_id: string
          service_id: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_id?: string | null
          base_amount?: number
          commission_amount?: number
          company_id?: string
          created_at?: string | null
          date?: string
          id?: string
          is_paid?: boolean
          notes?: string | null
          paid_date?: string | null
          percentage?: number
          professional_id?: string
          service_id?: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commissions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          business_hours: Json | null
          city: string | null
          created_at: string | null
          email: string | null
          id: string
          logo: string | null
          name: string
          phone: string | null
          settings: Json | null
          state: string | null
          updated_at: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          business_hours?: Json | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          logo?: string | null
          name: string
          phone?: string | null
          settings?: Json | null
          state?: string | null
          updated_at?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          business_hours?: Json | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          logo?: string | null
          name?: string
          phone?: string | null
          settings?: Json | null
          state?: string | null
          updated_at?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          appointment_reminder_hours: number | null
          cancellation_policy: string | null
          company_id: string
          created_at: string | null
          enable_email_notifications: boolean | null
          enable_online_booking: boolean | null
          enable_sms_notifications: boolean | null
          theme_color: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_reminder_hours?: number | null
          cancellation_policy?: string | null
          company_id: string
          created_at?: string | null
          enable_email_notifications?: boolean | null
          enable_online_booking?: boolean | null
          enable_sms_notifications?: boolean | null
          theme_color?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_reminder_hours?: number | null
          cancellation_policy?: string | null
          company_id?: string
          created_at?: string | null
          enable_email_notifications?: boolean | null
          enable_online_booking?: boolean | null
          enable_sms_notifications?: boolean | null
          theme_color?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_balances: {
        Row: {
          closed_at: string | null
          closed_by: string | null
          closing_balance: number
          company_id: string
          created_at: string | null
          date: string
          id: string
          is_closed: boolean
          notes: string | null
          opening_balance: number
          total_expense: number
          total_income: number
          updated_at: string | null
        }
        Insert: {
          closed_at?: string | null
          closed_by?: string | null
          closing_balance?: number
          company_id: string
          created_at?: string | null
          date: string
          id?: string
          is_closed?: boolean
          notes?: string | null
          opening_balance?: number
          total_expense?: number
          total_income?: number
          updated_at?: string | null
        }
        Update: {
          closed_at?: string | null
          closed_by?: string | null
          closing_balance?: number
          company_id?: string
          created_at?: string | null
          date?: string
          id?: string
          is_closed?: boolean
          notes?: string | null
          opening_balance?: number
          total_expense?: number
          total_income?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_balances_closed_by_fkey"
            columns: ["closed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_balances_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      plans: {
        Row: {
          created_at: string | null
          has_financial_access: boolean
          has_reports: boolean
          id: string
          max_appointments: number | null
          max_professionals: number | null
          name: Database["public"]["Enums"]["plan_type"]
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          has_financial_access?: boolean
          has_reports?: boolean
          id?: string
          max_appointments?: number | null
          max_professionals?: number | null
          name: Database["public"]["Enums"]["plan_type"]
          price?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          has_financial_access?: boolean
          has_reports?: boolean
          id?: string
          max_appointments?: number | null
          max_professionals?: number | null
          name?: Database["public"]["Enums"]["plan_type"]
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      professional_services: {
        Row: {
          commission_percentage: number | null
          created_at: string | null
          professional_id: string
          service_id: string
          updated_at: string | null
        }
        Insert: {
          commission_percentage?: number | null
          created_at?: string | null
          professional_id: string
          service_id: string
          updated_at?: string | null
        }
        Update: {
          commission_percentage?: number | null
          created_at?: string | null
          professional_id?: string
          service_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professional_services_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "professional_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      professionals: {
        Row: {
          bio: string | null
          company_id: string
          created_at: string | null
          default_commission: number
          id: string
          name: string
          photo: string | null
          profile_id: string
          schedule: Json
          specialty: string | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          company_id: string
          created_at?: string | null
          default_commission?: number
          id?: string
          name: string
          photo?: string | null
          profile_id: string
          schedule: Json
          specialty?: string | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          company_id?: string
          created_at?: string | null
          default_commission?: number
          id?: string
          name?: string
          photo?: string | null
          profile_id?: string
          schedule?: Json
          specialty?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professionals_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "professionals_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          created_at: string | null
          first_name: string | null
          id: string
          is_active: boolean
          last_name: string | null
          phone: string | null
          preferences: Json | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          is_active?: boolean
          last_name?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean
          last_name?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string | null
          permission_id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string | null
          permission_id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string | null
          permission_id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      service_history: {
        Row: {
          appointment_id: string
          client_id: string
          company_id: string
          created_at: string | null
          date: string
          feedback: string | null
          id: string
          points_earned: number | null
          price: number
          professional_id: string
          rating: number | null
          service_id: string
          stamps_earned: number | null
          status: string
          updated_at: string | null
        }
        Insert: {
          appointment_id: string
          client_id: string
          company_id: string
          created_at?: string | null
          date: string
          feedback?: string | null
          id?: string
          points_earned?: number | null
          price: number
          professional_id: string
          rating?: number | null
          service_id: string
          stamps_earned?: number | null
          status: string
          updated_at?: string | null
        }
        Update: {
          appointment_id?: string
          client_id?: string
          company_id?: string
          created_at?: string | null
          date?: string
          feedback?: string | null
          id?: string
          points_earned?: number | null
          price?: number
          professional_id?: string
          rating?: number | null
          service_id?: string
          stamps_earned?: number | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_history_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: true
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_history_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_history_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_history_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_history_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category: Database["public"]["Enums"]["service_category"]
          combo_discount: number | null
          company_id: string
          created_at: string | null
          description: string | null
          duration: number
          id: string
          is_active: boolean
          is_combo: boolean
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["service_category"]
          combo_discount?: number | null
          company_id: string
          created_at?: string | null
          description?: string | null
          duration: number
          id?: string
          is_active?: boolean
          is_combo?: boolean
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["service_category"]
          combo_discount?: number | null
          company_id?: string
          created_at?: string | null
          description?: string | null
          duration?: number
          id?: string
          is_active?: boolean
          is_combo?: boolean
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          company_id: string
          created_at: string | null
          end_date: string | null
          id: string
          is_active: boolean
          last_reset_date: string | null
          next_reset_date: string | null
          payment_details: Json | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          plan_id: string
          start_date: string
          updated_at: string | null
          used_appointments: number
        }
        Insert: {
          company_id: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          last_reset_date?: string | null
          next_reset_date?: string | null
          payment_details?: Json | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          plan_id: string
          start_date?: string
          updated_at?: string | null
          used_appointments?: number
        }
        Update: {
          company_id?: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          last_reset_date?: string | null
          next_reset_date?: string | null
          payment_details?: Json | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          plan_id?: string
          start_date?: string
          updated_at?: string | null
          used_appointments?: number
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          appointment_id: string | null
          category: string
          client_id: string | null
          commission_amount: number | null
          company_id: string
          created_at: string | null
          date: string
          description: string
          id: string
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          professional_id: string | null
          status: string
          tags: string[] | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string | null
        }
        Insert: {
          amount: number
          appointment_id?: string | null
          category: string
          client_id?: string | null
          commission_amount?: number | null
          company_id: string
          created_at?: string | null
          date?: string
          description: string
          id?: string
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          professional_id?: string | null
          status?: string
          tags?: string[] | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Update: {
          amount?: number
          appointment_id?: string | null
          category?: string
          client_id?: string | null
          commission_amount?: number | null
          company_id?: string
          created_at?: string | null
          date?: string
          description?: string
          id?: string
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          professional_id?: string | null
          status?: string
          tags?: string[] | null
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_appointment_limit: {
        Args: { company_uuid: string }
        Returns: boolean
      }
      check_company_permission: {
        Args: { company_uuid: string; permission_name: string }
        Returns: boolean
      }
      get_user_company_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      user_has_company_access: {
        Args: { company_uuid: string }
        Returns: boolean
      }
      user_has_permission: {
        Args: { permission_name: string }
        Returns: boolean
      }
    }
    Enums: {
      appointment_status:
        | "scheduled"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "no_show"
      communication_preference: "email" | "phone" | "whatsapp"
      payment_method: "cash" | "pix" | "credit_card" | "debit_card"
      plan_type: "Gratuito" | "Profissional"
      service_category:
        | "hair"
        | "nails"
        | "skincare"
        | "makeup"
        | "other"
        | "combo"
      transaction_type: "income" | "expense"
      user_role: "admin" | "company_admin" | "professional" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      appointment_status: [
        "scheduled",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "no_show",
      ],
      communication_preference: ["email", "phone", "whatsapp"],
      payment_method: ["cash", "pix", "credit_card", "debit_card"],
      plan_type: ["Gratuito", "Profissional"],
      service_category: [
        "hair",
        "nails",
        "skincare",
        "makeup",
        "other",
        "combo",
      ],
      transaction_type: ["income", "expense"],
      user_role: ["admin", "company_admin", "professional", "client"],
    },
  },
} as const
