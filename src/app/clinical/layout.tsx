import SideNav from "@/components/clinical/sidenav";
import Container from "@/components/container";
import Userbar from "@/components/userbar";
import NavLabel from "@/components/clinical/nav-label";
import { getGrantedRoles } from "@/backend/api/admin";
// FEEDBACK PHASE — remover as 2 linhas abaixo após encerrar fase de testes
import { FeedbackProvider } from "@/components/feedback/feedback-context";
import FeedbackWidget from "@/components/feedback/feedback-widget";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>){
  const routes = await getGrantedRoles();
  const routeMap = new Map<string, typeof routes[number]>();
  routes.forEach(e => routeMap.set(e.href, e));

  return(
    // FEEDBACK PHASE — substituir <FeedbackProvider> por <> após encerrar fase de testes
    <FeedbackProvider>
      <main className="md:flex h-screen">
        <SideNav />
        <div className="mt-0 ms-[320px] w-full">
          <div className="sticky top-0 z-10 mb-10">
            <Userbar />
            <NavLabel routes={routeMap} />
          </div>

          <Container>{children}</Container>
        </div>
      </main>
      <FeedbackWidget />
    </FeedbackProvider>
  );
}