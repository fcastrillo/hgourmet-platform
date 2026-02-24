//export const WHATSAPP_NUMBER = "529991978260";
export const WHATSAPP_NUMBER = "525550682072";

export const SOCIAL_LINKS = {
  whatsapp: `https://wa.me/${WHATSAPP_NUMBER}`,
  facebook: "https://facebook.com/hgourmetoficial",
  instagram: "https://instagram.com/hgourmet",
} as const;

export const STORE_INFO = {
  name: "HGourmet",
  tagline: "Empresa proveedora de productos para repostería y pastería",
  city: "Mérida, Yucatán",
  phone: WHATSAPP_NUMBER,
  email: "hgourmetoficial@gmail.com",
  address: "Calle 5, #117, Entre 22 y 3, Local 5, Mérida, México, 97139",
  hours: "Lun – Sáb: 9:00 – 18:00 · Domingos: cerrado",
} as const;

export const PRODUCTS_PER_PAGE = 12;
export const FEATURED_PRODUCTS_LIMIT = 8;
