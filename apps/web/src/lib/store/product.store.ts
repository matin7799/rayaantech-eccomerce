import { create } from "zustand";

/**
 * Media item from the product gallery.
 */
export interface GalleryImage {
  id: string;
  url: string;
  webpUrl: string | null;
  mimeType: string;
  displayOrder: number;
  isThumbnail: boolean;
}

/**
 * Product variant with EAV attributes.
 */
export interface ProductVariant {
  id: string;
  sku: string;
  stock: number;
  priceModifier: number;
  effectivePrice?: number;
  pricingTier?: string;
  attributes: { key: string; value: string }[];
}

/**
 * Product store state — manages active variant and gallery for PDP.
 */
interface ProductStoreState {
  /** Currently selected variant ID (null = base product) */
  selectedVariantId: string | null;
  /** Active gallery image index */
  activeImageIndex: number;
  /** Full gallery array (set when product loads) */
  gallery: GalleryImage[];
  /** All variants for this product */
  variants: ProductVariant[];

  /** Select a variant — updates price display and may switch active image */
  selectVariant: (variantId: string | null) => void;
  /** Set the active image by index */
  setActiveImage: (index: number) => void;
  /** Initialize store with product data */
  initialize: (gallery: GalleryImage[], variants: ProductVariant[]) => void;
  /** Reset store state */
  reset: () => void;
}

/**
 * useProductStore — PDP state controller.
 *
 * Manages:
 * - Selected variant (drives price modifier + attribute highlighting)
 * - Active gallery image (cross-fade on variant switch)
 * - Gallery and variant arrays (loaded on PDP mount)
 */
export const useProductStore = create<ProductStoreState>((set) => ({
  selectedVariantId: null,
  activeImageIndex: 0,
  gallery: [],
  variants: [],

  selectVariant: (variantId) => {
    set({ selectedVariantId: variantId, activeImageIndex: 0 });
  },

  setActiveImage: (index) => {
    set({ activeImageIndex: index });
  },

  initialize: (gallery, variants) => {
    set({
      gallery,
      variants,
      selectedVariantId: variants.length > 0 ? variants[0].id : null,
      activeImageIndex: 0,
    });
  },

  reset: () => {
    set({
      selectedVariantId: null,
      activeImageIndex: 0,
      gallery: [],
      variants: [],
    });
  },
}));
