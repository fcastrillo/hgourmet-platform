export const WHATSAPP_NUMBER = "529991978260";

export const SOCIAL_LINKS = {
  whatsapp: `https://wa.me/${WHATSAPP_NUMBER}`,
  facebook: "https://facebook.com/hgourmetoficial",
  instagram: "https://instagram.com/hgourmet.mid",
} as const;

export const STORE_INFO = {
  name: "HGourmet",
  tagline: "Empresa proveedora de productos para repostería y pastería",
  city: "Mérida, Yucatán",
  phone: WHATSAPP_NUMBER,
  email: "contacto@hgourmet.com.mx",
  address: "Calle 5, #117, Entre 22 y 3, Local 5, Mérida, México, 97139",
  hours: "Lun – Vie: 9:00 – 19:00 Sáb: 8:00 – 15:00 · Domingos: cerrado",
} as const;

export const STORE_MAP = {
  embedUrl:
    "https://www.google.com/maps?q=Placita%20De%20Montecristo%2C%20Calle%205%20117-Loc%205%2C%20entre%2022%20Y%203%2C%20San%20Antonio%20Cinta%2C%2097139%20M%C3%A9rida%2C%20Yuc.&output=embed",
  directionsUrl:
    "https://www.google.com/maps/place/Hgourmet/@21.0089858,-89.6200712,15z/data=!4m10!1m2!2m1!1sPlacita+De+Montecristo,+Calle+5+117-Loc+5,+entre+22+Y+3,+San+Antonio+Cinta,+97139+M%C3%A9rida,+Yuc.!3m6!1s0x8f56774e48f3260b:0xe69df2207b3ac37a!8m2!3d21.0089858!4d-89.6020468!15sCl9QbGFjaXRhIERlIE1vbnRlY3Jpc3RvLCBDYWxsZSA1IDExNy1Mb2MgNSwgZW50cmUgMjIgWSAzLCBTYW4gQW50b25pbyBDaW50YSwgOTcxMzkgTcOpcmlkYSwgWXVjLlpbIllwbGFjaXRhIGRlIG1vbnRlY3Jpc3RvIGNhbGxlIDUgMTE3IGxvYyA1IGVudHJlIDIyIHkgMyBzYW4gYW50b25pbyBjaW50YSA5NzEzOSBtw6lyaWRhIHl1Y5IBE2Jha2luZ19zdXBwbHlfc3RvcmWaASNDaFpEU1VoTk1HOW5TMFZKUTBGblNVUlVlWFZxWlVKUkVBReABAPoBBAgAEEU!16s%2Fg%2F11rq3wf6xx?entry=ttu&g_ep=EgoyMDI2MDMxMS4wIKXMDSoASAFQAw%3D%3D",
} as const;

export const PRODUCTS_PER_PAGE = 12;
export const FEATURED_PRODUCTS_LIMIT = 8;
