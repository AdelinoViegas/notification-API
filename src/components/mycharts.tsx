"use client";

import { 
  MyAreaChart, 
  MyBarChart, 
  MyPieChart 
} from "@/components/charts";

export default function MyCharts(){
  return(
    <div>
      <div className="grid md:grid-cols-2">
        <MyBarChart />
        <MyPieChart />
      </div>
      <MyAreaChart />
    </div>
  )
}