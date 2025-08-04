import Header from "@/components/header";
import MyCharts from "@/components/mycharts";

export const dynamic = "force-dynamic";

export default function Page(){
  return(
    <main>
      <Header title="Painel inicial" />

      <MyCharts />
    </main>
  )
}