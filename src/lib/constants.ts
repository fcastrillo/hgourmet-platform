export const WHATSAPP_NUMBER = "529991234567";

export const SOCIAL_LINKS = {
  whatsapp: `https://wa.me/${WHATSAPP_NUMBER}`,
  facebook: "https://facebook.com/hgourmet",
  instagram: "https://instagram.com/hgourmet",
} as const;

export const STORE_INFO = {
  name: "HGourmet",
  tagline: "Insumos Gourmet para Repostería",
  city: "Mérida, Yucatán",
  phone: WHATSAPP_NUMBER,
} as const;

export const PRODUCTS_PER_PAGE = 12;
export const FEATURED_PRODUCTS_LIMIT = 8;
