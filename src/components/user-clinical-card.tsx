import SubTitle from "@/components/ui/subtitle";
import { redirect } from "next/navigation";
import UserClinicalForm from "@/components/forms/user-clinical-form";
import { getUser as getClinicalUser, getSpecialties } from "@/app/backend/api/clinical/api";
import { 
  getUser, 
  getUserGroup 
} from "@/app/backend/api/manager/api";

export default async function UserClinicalCard({
  userId,
  className
}:{
  userId: string;
  className?: string;
}){
  const user = await getUser(userId);
  const specialties = await getSpecialties();
  // const userGroup = await getUserGroup(user.userGroupId?.toString() as string);
  const clinicalUser = await getClinicalUser(userId);
  
  return(
    <div className={className?className:"border bg-white rounded-xl px-3 py-2"}>
      <SubTitle className="inline-flex mb-3">Informações adicionais</SubTitle>
      <UserClinicalForm
        {...{specialties}}
        jsonData={clinicalUser?JSON.stringify(clinicalUser):undefined}
      />
    </div>
  );
}