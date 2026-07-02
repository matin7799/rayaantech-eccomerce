/**
 * Raw product row shape from pgvector cosine similarity search.
 */
export interface ProductVectorRow extends Record<string, unknown> {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  base_price: string;
  discounted_price: string | null;
  grade: string;
  stock: number;
  similarity: number;
}
