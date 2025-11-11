import { resolvedBed } from "@/backend/api/clinical/hospitalization-api";
import Accommodate from "@/components/hospitalization/accommodate";

export default async function Page({
  params
}:{ 
  params: Promise<{ id: string }>;
  searchParams: Promise<{ r: "r" | "h" | "n" }>;
}){
  const { id } = await params;
  const bedPosition = await resolvedBed(id);

  return(
    <div>
      <div className="w-1/2">
        <Accommodate
          serviceId={bedPosition?.internalService.id as string}
          sectionId={bedPosition?.section.id as string}
          nursingId={bedPosition?.nursing.id as string}
          bedId={bedPosition?.bed.id as string}
        />
      </div>
    </div>
  )
}