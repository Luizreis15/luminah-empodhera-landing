export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      campaigns: {
        Row: {
          created_at: string
          created_by: string | null
          html_content: string
          id: string
          scheduled_at: string | null
          sent_at: string | null
          status: string
          subject: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          html_content: string
          id?: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          html_content?: string
          id?: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          title?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          icon: string | null
          id: string
          name: string
          type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
          type: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: []
      }
      contacts: {
        Row: {
          created_at: string
          created_by: string | null
          email: string
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email: string
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          campaign_id: string
          contact_id: string
          created_at: string
          error_message: string | null
          id: string
          sent_at: string | null
          status: string
        }
        Insert: {
          campaign_id: string
          contact_id: string
          created_at?: string
          error_message?: string | null
          id?: string
          sent_at?: string | null
          status?: string
        }
        Update: {
          campaign_id?: string
          contact_id?: string
          created_at?: string
          error_message?: string | null
          id?: string
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_logs_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          amount: number
          buyer_email: string
          buyer_name: string
          buyer_phone: string | null
          created_at: string | null
          created_by: string
          creator: Database["public"]["Enums"]["transaction_source"] | null
          date: string
          id: string
          notes: string | null
          platform: Database["public"]["Enums"]["sale_platform"]
          source: Database["public"]["Enums"]["transaction_source"]
          transaction_id: string | null
        }
        Insert: {
          amount: number
          buyer_email: string
          buyer_name: string
          buyer_phone?: string | null
          created_at?: string | null
          created_by: string
          creator?: Database["public"]["Enums"]["transaction_source"] | null
          date: string
          id?: string
          notes?: string | null
          platform: Database["public"]["Enums"]["sale_platform"]
          source: Database["public"]["Enums"]["transaction_source"]
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          buyer_email?: string
          buyer_name?: string
          buyer_phone?: string | null
          created_at?: string | null
          created_by?: string
          creator?: Database["public"]["Enums"]["transaction_source"] | null
          date?: string
          id?: string
          notes?: string | null
          platform?: Database["public"]["Enums"]["sale_platform"]
          source?: Database["public"]["Enums"]["transaction_source"]
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsors: {
        Row: {
          benefits_delivered: Json | null
          company_name: string
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          contracted_value: number
          created_at: string | null
          created_by: string
          id: string
          notes: string | null
          payment_status: Database["public"]["Enums"]["transaction_status"]
          plan: Database["public"]["Enums"]["sponsor_plan"]
          updated_at: string | null
        }
        Insert: {
          benefits_delivered?: Json | null
          company_name: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contracted_value: number
          created_at?: string | null
          created_by: string
          id?: string
          notes?: string | null
          payment_status?: Database["public"]["Enums"]["transaction_status"]
          plan: Database["public"]["Enums"]["sponsor_plan"]
          updated_at?: string | null
        }
        Update: {
          benefits_delivered?: Json | null
          company_name?: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contracted_value?: number
          created_at?: string | null
          created_by?: string
          id?: string
          notes?: string | null
          payment_status?: Database["public"]["Enums"]["transaction_status"]
          plan?: Database["public"]["Enums"]["sponsor_plan"]
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string | null
          created_by: string
          date: string
          description: string | null
          id: string
          is_recurring: boolean | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          source: Database["public"]["Enums"]["transaction_source"] | null
          status: Database["public"]["Enums"]["transaction_status"]
          subcategory: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string | null
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string | null
          created_by: string
          date: string
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          source?: Database["public"]["Enums"]["transaction_source"] | null
          status?: Database["public"]["Enums"]["transaction_status"]
          subcategory?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string | null
          created_by?: string
          date?: string
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          source?: Database["public"]["Enums"]["transaction_source"] | null
          status?: Database["public"]["Enums"]["transaction_status"]
          subcategory?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      waiting_list: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          subscribed_to_marketing: boolean | null
          unsubscribed_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          subscribed_to_marketing?: boolean | null
          unsubscribed_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          subscribed_to_marketing?: boolean | null
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      workbook_responses: {
        Row: {
          activity_id: string
          created_at: string | null
          id: string
          module_id: number
          response: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activity_id: string
          created_at?: string | null
          id?: string
          module_id: number
          response?: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activity_id?: string
          created_at?: string | null
          id?: string
          module_id?: number
          response?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "financeiro" | "viewer"
      payment_method: "pix" | "credito" | "debito" | "transferencia" | "boleto"
      sale_platform: "site" | "whatsapp" | "instagram" | "sympla" | "indicacao"
      sponsor_plan: "bronze" | "prata" | "ouro" | "diamante"
      transaction_source:
        | "organico"
        | "indicacao"
        | "criadora_samira"
        | "criadora_simone"
        | "criadora_sueli"
        | "trafego_pago"
      transaction_status: "previsto" | "recebido" | "pago" | "cancelado"
      transaction_type: "receita" | "despesa"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "financeiro", "viewer"],
      payment_method: ["pix", "credito", "debito", "transferencia", "boleto"],
      sale_platform: ["site", "whatsapp", "instagram", "sympla", "indicacao"],
      sponsor_plan: ["bronze", "prata", "ouro", "diamante"],
      transaction_source: [
        "organico",
        "indicacao",
        "criadora_samira",
        "criadora_simone",
        "criadora_sueli",
        "trafego_pago",
      ],
      transaction_status: ["previsto", "recebido", "pago", "cancelado"],
      transaction_type: ["receita", "despesa"],
    },
  },
} as const
