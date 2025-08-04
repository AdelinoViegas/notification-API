"use client";

import Header from "@/components/header";
import { MyAreaChart, MyBarChart, MyLineChart, MyPieChart, MyRadarChart } from "@/components/charts";

export const dynamic = "force-dynamic";

export default function Page(){
  return(
    <main>
      <Header title="Painel inicial" />

      <div className="grid md:grid-cols-3">
        <MyAreaChart />
        <MyBarChart />
        <MyLineChart />
        <MyPieChart />
        <MyRadarChart />
      </div>
    </main>
  )
}