import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  user_type: 'buyer' | 'seller';
  username: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  seller_id: string;
  title: string;
  subtitle?: string;
  description: string;
  category: 'discord' | 'chrome' | 'twitch';
  price: number;
  image_url?: string;
  gallery_urls?: string[];
  file_url?: string;
  version: string;
  status: 'draft' | 'pending' | 'published';
  downloads: number;
  sales: number;
  rating_avg: number;
  rating_count: number;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: string;
  buyer_id: string;
  seller_id: string;
  product_id: string;
  order_number: string;
  amount: number;
  commission: number;
  status: 'pending' | 'completed' | 'refunded';
  stripe_payment_id?: string;
  created_at: string;
};

export type Review = {
  id: string;
  product_id: string;
  buyer_id: string;
  order_id: string;
  rating: number;
  title?: string;
  comment: string;
  seller_response?: string;
  helpful_count: number;
  created_at: string;
  updated_at: string;
};
