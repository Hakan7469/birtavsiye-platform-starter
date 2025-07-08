// types/supabase.ts

export type Recommendation = {
  id: string;
  uuid: string | null;
  title: string | null;
  content: string | null;
  author: string | null;
  created_at: string | null;
  highlighted_text: any; // JSON olabilir
  topic_id: string | null;
  like: number | null;
  dislike: number | null;
};

export type Entry = {
  id: string;
  recommendation_id: string;
  content: string;
  author: string;
  created_at: string;
};
