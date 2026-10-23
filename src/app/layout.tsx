import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { prisma } from "../lib/prisma";
import "./globals.css";

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#080b11',
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Gera os metadados da página dinamicamente a partir das configurações do banco.
 * Permite que o Admin altere título, descrição e favicon sem precisar fazer deploy.
 */
export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await prisma.systemSetting.findFirst();

    const title = settings?.siteTitle || "PuxarPlaca - Consulta Veicular e Dados Cadastrais";
    const description = settings?.siteDescription || "Plataforma profissional para consultas veiculares pela placa, CPF, CNPJ e histórico.";
    const keywords = settings?.siteKeywords || "consultas, placa, veículos, detran, senatran, cpf, cnpj";
    const faviconUrl = settings?.faviconUrl || "/favicon.ico";

    return {
      title,
      description,
      keywords,
      icons: {
        icon: [
          { url: faviconUrl, href: faviconUrl },
          { url: faviconUrl, href: faviconUrl, sizes: '32x32', type: 'image/png' },
        ],
        apple: faviconUrl,
        shortcut: faviconUrl,
      },
      openGraph: {
        title,
        description,
        type: "website",
        locale: "pt_BR",
      },
    };
  } catch {
    // Fallback caso o banco não esteja acessível ainda
    return {
      title: "PuxarPlaca - Consulta Veicular e Dados Cadastrais",
      description: "Plataforma profissional para consultas de veículos pela placa e dados cadastrais.",
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col`}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-W9LEXZJ5HG"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-W9LEXZJ5HG');
          `}
        </Script>
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Toaster richColors theme="dark" position="top-right" duration={4000} />
      </body>
    </html>
  );
}
