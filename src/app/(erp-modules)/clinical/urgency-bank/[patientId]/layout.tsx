import TabOffice from "@/components/clinical/tab-office";
import Header from "@/components/header";
import { getPatient } from "@/app/backend/api/clinical/api";
import clsx from "clsx";
import { priorityModel } from "@/app/backend/models/clinical";

export default async function Layout({ 
  children,
  params
}:{ 
  children: React.ReactNode;
  params: Promise<{
    patientId: string;
  }>
}){
  const { patientId } = await params;
  const patient = await getPatient(patientId); 
  const priority =  await priorityModel.findOne({ patientId: patientId });
  
  return(
    <div>
      <div className={clsx("my-4 text-center pt-3 text-white rounded-lg",
         {"bg-red-500 animate-pulse": priority?.priority === "red"},
         {"bg-blue-500": priority?.priority === "blue"},
         {"bg-green-500": priority?.priority=== "green"},
         {"bg-yellow-500": priority?.priority=== "yellow"},
         {"bg-orange-600": priority?.priority === "orange"}
       )}>
			 	<Header 
          center 
          title={patient?.personal.fullname as string}
        />
			</div>
      
      <div className="flex">
        <div className="bg-white px-3 lg:px-16 py-5 rounded-s-xl border border-e-0 max-h-sizeTab scroll overflow-auto w-full">
          {children}
        </div>
        <TabOffice />
      </div>
    </div>
  )
}