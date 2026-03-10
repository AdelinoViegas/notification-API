import { getService } from "@/backend/api/clinical/scheduling-api";
import { getCCGs } from "@/backend/api/clinical/scheduling-api";
import { getSpecialties } from "@/backend/api/clinical/api";
import UpdateService from "@/components/forms/update-service";

export default async function Page({ params }:{ params: Promise<{ id: string }>}){
  const { id } = await params;
  const service = await getService(id);
  const group = await getCCGs("group");
  const categories = await getCCGs("category", service?.kind as "exam" | "consultation" | "surgery");
  const classifications = await getCCGs("classification");
  const specialties = await getSpecialties();

  return (
    <main className="space-y-3">
      <UpdateService 
        service={JSON.stringify(service)} 
        groups={JSON.stringify(group)}
        categories={JSON.stringify(categories)}
        classifications={JSON.stringify(classifications)}
        specialties={JSON.stringify(specialties)}
      />
    </main> 
  );
}
