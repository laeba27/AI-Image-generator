import Providers from "@/app/providers";
import bgPattern from "@/public/bg-pattern-transparent.png";
import PlausibleProvider from "next-plausible";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Toaster } from 'sonner'



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="color-scheme" content="dark" />
        <PlausibleProvider domain="blinkshot.io" />
      </head>
      <body
        className={` dark h-full min-h-screen bg-[length:6px] font-mono text-gray-100 antialiased`}
        style={{ backgroundImage: `url(${bgPattern.src})` }}
      >
        <Providers>
          <div className="flex flex-col min-h-screen">
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
        <Toaster position="top-center" expand={true} richColors />
      </body>
    </html>
  );
}
