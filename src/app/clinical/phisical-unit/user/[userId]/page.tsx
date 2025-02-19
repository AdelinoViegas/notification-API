import Header from "@/components/header";
import Card from "@/components/ui/card";
import SubTitle from "@/components/ui/subtitle";
import Selection, { SelectionOption } from "@/components/ui/selection";
import Button from "@/components/ui/button";
import { BiTrash as TrashIcon } from "react-icons/bi";
import { 
  getUnits, 
  // grantUnitAccess, 
  getGrantedUnitAccess,
  removeUnitAccess,
} from "@/app/backend/api/clinical/urgency-bank-api";
import { getUser } from "@/app/backend/api/manager/api";
import UserClinicalConfig from "@/components/user-clinical-config";

export default async function Page({
   params 
  }:{
    params: Promise<{
       userId: string 
    }> 
  }) {
  const { userId } = await params;
  const workplaces = await getUnits("workplace", true) as SelectionOption[];
  const grantedAccess = await getGrantedUnitAccess(userId);
  const { fullname } = await getUser(userId, true);

  return (
    <main className="space-y-3">
 
      <div className="mt-6">
        <Header title={`Area de Trabalho | ${fullname}`}/>
      </div>
      
      <Card className="grid lg:grid-cols-2 gap-y-3 gap-x-10">
        <UserClinicalConfig userId={userId} />
        {/* <UserClinicalCard 
          className="mt-0" 
          userId={userId} 
        /> */}
  
        <div className="flex flex-col gap-y-6">
          <div>
            <SubTitle className="inline-flex">Area de Trabalho</SubTitle>
            
            <form action={'grantUnitAccess'}>
              <input 
                type="hidden" 
                name="userId" 
                value={userId} 
              />
              
              <Selection
                label="Areas de Trabalho"
                options={workplaces}
                required
                name="workplaceId"
              />

              <Button>Adicionar</Button>
            </form>
          </div>

          <div>
            <SubTitle className="inline-flex">Acesso Atribuidos</SubTitle>
            
            <div className="mt-3 p-3">
              {grantedAccess.map((item, i)=>(
                <div key={i} className="flex justify-between items-center gap-2 px-3 py-2 bg-gray-100 my-1 rounded-md border">
                  {item.label}
                  <form action={removeUnitAccess}>
                    <input type="hidden" name="accessId" value={item._id} />
                    <input type="hidden" name="userId" value={userId} />
                    <button className="bg-red-500 text-white px-2 rounded-md py-1">
                      <TrashIcon className="w-5"/>
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}
