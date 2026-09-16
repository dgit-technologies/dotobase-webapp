import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import AuthProvider from "@/components/auth/AuthProvider";
import { Toaster } from "@/components/ui/toast";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Dotobase — Votre santé, votre contrôle",
  description: "Plateforme nationale de dossiers médicaux électroniques — Bénin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${manrope.variable} h-full`}>
      <body className="min-h-full antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
