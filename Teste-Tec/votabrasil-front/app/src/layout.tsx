import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Importe SEMPRE para o Tailwind funcionar

// Carrega a fonte Inter (opcional)
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vota Brasil",
  description: "Acompanhamento de deputados federais",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth"> 
      <body className={`${inter.className} antialiased bg-gray-900 text-white`}>
        {children}
      </body>
    </html>
  );
}