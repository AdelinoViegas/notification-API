import SideNav from "@/components/clinical/sidenav";
import Container from "@/components/container";
import Userbar from "@/components/userbar";

export default async function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>){

  return(
    <main className="md:flex h-screen">
      <SideNav />
      <div className="w-full">
        <Userbar />
        <Container>{children}</Container>
      </div>
    </main>
  );
}