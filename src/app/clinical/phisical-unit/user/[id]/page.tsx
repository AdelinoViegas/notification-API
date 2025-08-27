import Header from "@/components/header";
import Card from "@/components/ui/card";
import UserClinicalConfig from "@/components/user-clinical-config";
import { getUser, getSpecialties } from "@/backend/api/clinical/api";
import { getUrgencyServices } from "@/backend/api/clinical/urgency-bank-api";
import UserWorkplace from "@/components/user-workplace";

export default async function Page({ params }:{ params: Promise<{ id: string }>}){
  const { id } = await params;
  const [ 
    user,
    urgencyServices,
    specialties,
  ] = await Promise.all([
    getUser(id),
    getUrgencyServices(),
    getSpecialties(),
  ]);

  return (
    <main className="space-y-3">
 
      <div className="mt-6">
        <Header title={`Area de Trabalho | ${user.fullname}`}/>
      </div>
      
      <Card className="grid lg:grid-cols-2 gap-y-3 gap-x-10">
        <UserClinicalConfig 
          userId={id}
          categoryId={user.categoryId}
          specialtyId={user.specialtyId}
          serviceId={user.serviceId} 
          orderNumber={user.orderNumber}
          services={urgencyServices}
          specialties={specialties}
        />

        <UserWorkplace userId={id} />
      </Card>
    </main>
  );
}
