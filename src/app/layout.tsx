import type { Metadata } from "next";
// import { Rubik } from 'next/font/google';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import localFont from 'next/font/local';

// const onlineFont = Rubik({
//   subsets: []
// });

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
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}
