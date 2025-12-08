import BedUpdate from "@/components/hospitalization/bed-update";
import { 
  getInternalServices, 
  getNursings, 
  getSections, 
  resolvedBed
} from "@/backend/api/clinical/hospitalization-api";

export default async function Page({ params }:{ params: Promise<{ id: string }> }){
  const { id } = await params;
  const bed = await resolvedBed(id);
  const services = await getInternalServices();
  const sections = await getSections();
  const nursings = await getNursings({ internalServiceId: bed?.internalService?.id  });

  return(
    <div className="w-1/2 space-y-3">
      <BedUpdate
        services={services}
        sections={sections}
        nursings={nursings}
        serviceId={bed?.internalService?.id as string}
        nursingId={bed?.nursing?.id as string}
        sectionId={bed?.section?.id as string}
        bedName={bed?.bed?.name as string}
      />
    </div>
  )
}