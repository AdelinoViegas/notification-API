"use client";

import { useSearchParams, useParams } from "next/navigation";
import TabNav from "@/components/tabnav";
export default function Page(){
  const searchParams = useSearchParams();
  const params = useParams<{ patientId: string }>();
  const route = searchParams.get("r");

  return(
    <main>
      <TabNav
        baseUrl="/clinical/screening"
        idAsIndexPage
        keyParam="" 
        useReactHook
        subPaths={[
          { title: "route 1", path: "route_1" },
          { title: "route 2", path: "route_2" }
        ]}
      />
      {route}{JSON.stringify(params)}
    </main>
  );
}