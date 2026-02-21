export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  inStock: boolean;
}

export const categories = [
  "Chocolates",
  "Harinas",
  "Sprinkles",
  "Moldes",
  "Materia Prima",
  "Accesorios",
] as const;

export type Category = (typeof categories)[number];

export const products: Product[] = [
  { id: 1, name: "Chocolate Callebaut 70%", price: 189, category: "Chocolates", description: "Chocolate belga oscuro con 70% de cacao, ideal para ganaches, trufas y coberturas profesionales. Textura suave y sabor intenso.", inStock: true },
  { id: 2, name: "Harina de Almendra 500g", price: 145, category: "Harinas", description: "Harina de almendra finamente molida, perfecta para macarons, bizcochos sin gluten y bases de tarta. Origen selecto.", inStock: true },
  { id: 3, name: "Sprinkles Arcoíris", price: 65, category: "Sprinkles", description: "Sprinkles multicolor en formato jimmies, ideales para decorar pasteles, cupcakes y galletas. Colores vibrantes y seguros.", inStock: true },
  { id: 4, name: "Molde Silicón Rosas", price: 235, category: "Moldes", description: "Molde de silicón con 6 cavidades en forma de rosa. Apto para horno y congelador. Desmolde fácil y duradero.", inStock: true },
  { id: 5, name: "Manteca de Cacao 1kg", price: 320, category: "Materia Prima", description: "Manteca de cacao pura, desodorizada. Esencial para templar chocolate y elaborar bombones profesionales.", inStock: true },
  { id: 6, name: "Set Boquillas Wilton x12", price: 189, category: "Accesorios", description: "Set de 12 boquillas de acero inoxidable Wilton para decoración profesional. Incluye puntas de estrella, hoja y redondas.", inStock: false },
  { id: 7, name: "Fondant Satin Ice 1kg", price: 280, category: "Materia Prima", description: "Fondant profesional listo para usar. Textura elástica, fácil de manejar y con acabado satinado perfecto para pasteles.", inStock: true },
  { id: 8, name: "Colorante en Gel Americolor", price: 95, category: "Accesorios", description: "Colorante concentrado en gel Americolor. No altera la consistencia de masas y cremas. Gran variedad de tonos disponibles.", inStock: true },
  { id: 9, name: "Chocolate Blanco Callebaut", price: 210, category: "Chocolates", description: "Chocolate blanco belga premium con notas de vainilla y caramelo. Ideal para mousses, ganaches y decoración.", inStock: true },
  { id: 10, name: "Harina de Coco 350g", price: 98, category: "Harinas", description: "Harina de coco orgánica, alta en fibra y sin gluten. Perfecta para recetas saludables y panificación alternativa.", inStock: false },
  { id: 11, name: "Sprinkles Perlas Doradas", price: 85, category: "Sprinkles", description: "Perlas de azúcar con acabado metalizado dorado. Ideales para decorar pasteles de bodas y eventos elegantes.", inStock: true },
  { id: 12, name: "Molde Silicón Semiesfera", price: 195, category: "Moldes", description: "Molde de silicón con 6 cavidades semiesféricas. Perfecto para bombas de chocolate, mousse y postres modernos.", inStock: true },
];

export const getProduct = (id: number) => products.find((p) => p.id === id);

export const getRelatedProducts = (product: Product) =>
  products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4).length >= 2
    ? products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4)
    : products.filter((p) => p.id !== product.id).slice(0, 4);
