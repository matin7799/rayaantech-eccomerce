export interface StoryItem {
  id: string;
  title: string;
  mediaUrl: string;
  productId?: string | null;
  product: {
    id: string;
    name: string;
    slug: string;
    price: string;
    stock: number;
    inStock: boolean;
    categoryId: string;
  } | null;
}
