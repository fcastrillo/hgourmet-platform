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
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      banners: {
        Row: {
          id: string;
          title: string | null;
          subtitle: string | null;
          image_url: string;
          link_url: string | null;
          is_active: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title?: string | null;
          subtitle?: string | null;
          image_url: string;
          link_url?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string | null;
          subtitle?: string | null;
          image_url?: string;
          link_url?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
        };
      };
      brands: {
        Row: {
          id: string;
          name: string;
          logo_url: string | null;
          website_url: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          logo_url?: string | null;
          website_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          logo_url?: string | null;
          website_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      recipes: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          image_url: string | null;
          is_published: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          image_url?: string | null;
          is_published?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          image_url?: string | null;
          is_published?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          slug: string;
          description: string | null;
          price: number;
          image_url: string | null;
          sku: string | null;
          is_available: boolean;
          is_featured: boolean;
          is_seasonal: boolean;
          is_visible: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          slug: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          sku?: string | null;
          is_available?: boolean;
          is_featured?: boolean;
          is_seasonal?: boolean;
          is_visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          price?: number;
          image_url?: string | null;
          sku?: string | null;
          is_available?: boolean;
          is_featured?: boolean;
          is_seasonal?: boolean;
          is_visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type Banner = Database["public"]["Tables"]["banners"]["Row"];
export type Brand = Database["public"]["Tables"]["brands"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Recipe = Database["public"]["Tables"]["recipes"]["Row"];

export type CategoryWithProductCount = Category & {
  product_count: number;
};

export type ProductWithCategory = Product & {
  categories: Pick<Category, "name" | "slug">;
};
