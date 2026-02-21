import type { Metadata } from "next";
import { Poppins, Nunito } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HGourmet — Insumos Gourmet para Repostería en Mérida",
    template: "%s | HGourmet",
  },
  description:
    "Tienda de insumos gourmet para repostería en Mérida, Yucatán. Chocolate, harinas, moldes, sprinkles y más. Consulta nuestro catálogo y pide por WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${poppins.variable} ${nunito.variable} font-body bg-background text-text antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
