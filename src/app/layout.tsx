import type { Metadata } from "next";
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import localFont from 'next/font/local';
import Refresh from "@/components/refresh";

const local = localFont({ 
  src: [
    { 
      path: './fonts/GeistVF.woff', 
      weight: "400", 
      style: "normal" 
    },
    { 
      path: './fonts/GeistMonoVF.woff', 
      weight: "700", 
      style: "normal" 
    },
    { 
      path: './fonts/GeistMonoVF.woff', 
      weight: "600", 
      style: "normal" 
    }
  ] 
});

export const metadata: Metadata = {
  title: "MASTER ERP",
  description: "Sistema de Gestão Integrado - ERP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-ao">
      <body className={`${local.className} antialiased`}>
        <Refresh />
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}
