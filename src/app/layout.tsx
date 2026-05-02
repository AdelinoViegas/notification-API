import type { Metadata } from "next";
import { Inter } from "next/font/google";
// @ts-ignore
import '@/app/globals.css';
import ToastProvider from "@/components/toastProvider";
import 'react-toastify/dist/ReactToastify.css';

// const local = localFont({ 
//   src: [
//     { 
//       path: './fonts/GeistVF.woff', 
//       weight: "400", 
//       style: "normal" 
//     },
//     { 
//       path: './fonts/GeistMonoVF.woff', 
//       weight: "700", 
//       style: "normal" 
//     },
//     { 
//       path: './fonts/GeistMonoVF.woff', 
//       weight: "600", 
//       style: "normal" 
//     }
//   ] 
// });

const font = Inter({
  subsets: ["latin"]
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
