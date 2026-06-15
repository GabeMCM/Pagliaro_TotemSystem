import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "../styles.css";
import { HomenagemProvider } from "../lib/homenagem-store";
import { EnvironmentLayer } from "../components/environment/EnvironmentLayer";
import { OfflineSyncManager } from "../components/OfflineSyncManager";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Culto da Saudade - Sistema Totem",
  description: "Homenagens e doações",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Totem Saudade",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <HomenagemProvider>
          <OfflineSyncManager />
          <EnvironmentLayer />
          <div className="absolute inset-0 z-50 flex flex-col">
            {children}
          </div>
        </HomenagemProvider>
      </body>
    </html>
  );
}
