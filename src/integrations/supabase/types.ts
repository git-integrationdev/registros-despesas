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
      agent: {
        Row: {
          company_id: number
          created_at: string
          id: number
          name: string | null
          status: number | null
          wpp_agente: number | null
        }
        Insert: {
          company_id: number
          created_at?: string
          id?: number
          name?: string | null
          status?: number | null
          wpp_agente?: number | null
        }
        Update: {
          company_id?: number
          created_at?: string
          id?: number
          name?: string | null
          status?: number | null
          wpp_agente?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agente_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
        ]
      }
      chat: {
        Row: {
          agent_id: number
          created_at: string
          id: number
          message_content: string | null
          used_model: string | null
          used_tokens: number | null
          wpp_number: number
        }
        Insert: {
          agent_id: number
          created_at?: string
          id?: number
          message_content?: string | null
          used_model?: string | null
          used_tokens?: number | null
          wpp_number: number
        }
        Update: {
          agent_id?: number
          created_at?: string
          id?: number
          message_content?: string | null
          used_model?: string | null
          used_tokens?: number | null
          wpp_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "chat_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_wpp_number_fkey"
            columns: ["wpp_number"]
            isOneToOne: false
            referencedRelation: "client"
            referencedColumns: ["wpp_number"]
          },
        ]
      }
      client: {
        Row: {
          agent_id: number
          created_at: string
          data_da_avaliacao: string | null
          follow_up: boolean | null
          lost_reason: Database["public"]["Enums"]["lost_reason"] | null
          name: string | null
          relato: string | null
          resumo: string | null
          temperatura: string | null
          wpp_number: number
        }
        Insert: {
          agent_id: number
          created_at?: string
          data_da_avaliacao?: string | null
          follow_up?: boolean | null
          lost_reason?: Database["public"]["Enums"]["lost_reason"] | null
          name?: string | null
          relato?: string | null
          resumo?: string | null
          temperatura?: string | null
          wpp_number: number
        }
        Update: {
          agent_id?: number
          created_at?: string
          data_da_avaliacao?: string | null
          follow_up?: boolean | null
          lost_reason?: Database["public"]["Enums"]["lost_reason"] | null
          name?: string | null
          relato?: string | null
          resumo?: string | null
          temperatura?: string | null
          wpp_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "client_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent"
            referencedColumns: ["id"]
          },
        ]
      }
      company: {
        Row: {
          created_at: string | null
          email: string | null
          id: number
          nome: string
          status: number
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: number
          nome: string
          status?: number
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: number
          nome?: string
          status?: number
        }
        Relationships: []
      }
      registros: {
        Row: {
          categoria: string | null
          celular: number | null
          created_at: string
          data: string | null
          id: number
          observacao: string | null
          tipo: string | null
          titulo: string | null
          valor: number | null
        }
        Insert: {
          categoria?: string | null
          celular?: number | null
          created_at?: string
          data?: string | null
          id?: number
          observacao?: string | null
          tipo?: string | null
          titulo?: string | null
          valor?: number | null
        }
        Update: {
          categoria?: string | null
          celular?: number | null
          created_at?: string
          data?: string | null
          id?: number
          observacao?: string | null
          tipo?: string | null
          titulo?: string | null
          valor?: number | null
        }
        Relationships: []
      }
      temp: {
        Row: {
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
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
      lost_reason:
        | "Ajuste de sistema"
        | "Valor"
        | "Sem interesse"
        | "Estudante"
        | "Procurando emprego"
        | "Indefinido"
      status: "lead" | "lead_qualificado" | "oportunidade" | "perdido"
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
      lost_reason: [
        "Ajuste de sistema",
        "Valor",
        "Sem interesse",
        "Estudante",
        "Procurando emprego",
        "Indefinido",
      ],
      status: ["lead", "lead_qualificado", "oportunidade", "perdido"],
    },
  },
} as const
