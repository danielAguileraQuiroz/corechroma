import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WhatsAppProvider } from "@/context/WhatsAppContext";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CoreChroma | Configurador y Pantallas LED",
  description: "Ingeniería, cálculo técnico y cotización de pantallas LED para compra y alquiler.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <WhatsAppProvider>
          {children}
          <WhatsAppFloatingButton />
        </WhatsAppProvider>
      </body>
    </html>
  );
}