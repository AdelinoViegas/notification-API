import SideNav from "@/components/clinical/sidenav";
import Container from "@/components/container";
import Userbar from "@/components/userbar";
import NavLabel from "@/components/clinical/nav-label";
import { getGrantedRoles } from "@/backend/api/admin";

export default async function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>){
  const routes = await getGrantedRoles();
  const routeMap = new Map<string, typeof routes[number]>();
  routes.forEach(e => routeMap.set(e.href, e));

  return(
    <main className="md:flex h-screen">
      <SideNav />
      <div className="w-full">
        <Userbar />
        <NavLabel routes={routeMap} />
        <Container>{children}</Container>
      </div>
    </main>
  );
}