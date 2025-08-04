"use client";

import Header from "@/components/header";
import { MyAreaChart, MyBarChart, MyPieChart } from "@/components/charts";

export const dynamic = "force-dynamic";

export default function Page(){
  return(
    <main>
      <Header title="Painel inicial" />

      <div className="grid md:grid-cols-2">
        <MyBarChart />
        <MyPieChart />
      </div>
      <MyAreaChart />
    </main>
  )
}