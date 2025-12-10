import Card from "@/components/ui/card";
import UserClinicalConfig from "@/components/user-clinical-config";
import UserWorkplace from "@/components/user-workplace";
import { getUrgencyServices } from "@/backend/api/clinical/urgency-bank-api";
import { getUser, getSpecialties } from "@/backend/api/clinical/api";
import { getInternalServices } from "@/backend/api/clinical/hospitalization-api";

export default async function Page({ params }:{ params: Promise<{ id: string }>}){
  const { id } = await params;
  const [ 
    user,
    urgencyServices,
    specialties,
    internalServices
  ] = await Promise.all([
    getUser(id),
    getUrgencyServices(),
    getSpecialties(),
    getInternalServices()
  ]);

  return (
    <main className="space-y-3">
      <h2 className="uppercase text-lg font-medium">{user.fullname}</h2>
      
      <Card className="grid lg:grid-cols-2 gap-y-3 gap-x-10">
        <UserClinicalConfig 
          userId={id}
          categoryId={user.categoryId}
          specialtyId={user.specialtyId}
          serviceId={user.serviceId} 
          orderNumber={user.orderNumber}
          services={urgencyServices}
          specialties={specialties}
          internalServices={internalServices}
          internalServiceId={user.internalServiceId}
        />

        <UserWorkplace userId={id} />
      </Card>
    </main>
  );
}
