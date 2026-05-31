import type { Metadata } from "next";
import localFont from "next/font/local";
import './globals.css';
import ToastProvider from "@/components/toastProvider";
import 'react-toastify/dist/ReactToastify.css';

const font = localFont({
  src: './fonts/Inter-latin.woff2',
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = { title: "Master ERP" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-ao">
      <body className={font.className}>
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
