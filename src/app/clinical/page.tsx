import Header from "@/components/header";
import { MyBarChart } from "@/components/charts";

export const dynamic = "force-dynamic";

export default function Page(){
  return(
    <main className="py-3">
      <Header title="Painel inicial" />

      <div>
        <MyBarChart />
      </div>
    </main>
  )
}