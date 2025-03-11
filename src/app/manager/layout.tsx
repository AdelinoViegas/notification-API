import SideNav from "@/components/sidenav";
import type { Metadata } from "next";
import StatusLoginUser from "@/components/status-bar";
export const dynamic = "force-dynamic";

export const metadata:Metadata = {
  title: 'Administrador'
}
export default function Layout({
  children
}: {
  children: React.ReactNode;
}){
  return(
    <main className="md:flex h-screen">
      <SideNav />
      <div className="md:w-full">
        <StatusLoginUser />
        <div className="mx-6 lg:mx-32">
          {children}
        </div>
      </div>
    </main>
  );
}