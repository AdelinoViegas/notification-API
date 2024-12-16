import SideNav from "@/components/clinical/sidenav";
import StatusLoginUser from "@/components/status-bar";
import Container from "@/components/container";

export default async function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>){

  return(
    <main className="md:flex h-screen">
      <SideNav />
      <div className="w-full">
        <StatusLoginUser />
        <Container>
          {children}
        </Container>
      </div>
    </main>
  );
}