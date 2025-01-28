import SubTitle from "@/components/ui/subtitle";
import { redirect } from "next/navigation";
import Alert from "@/components/ui/alert";
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

  if(user?.status === false)
    redirect("/manager/?invalid-user");

  const userGroup = await getUserGroup(user.userGroupId?.toString() as string);
  const userData = await getClinicalUser(userId);

  return(
    <div className={className?className:"border bg-white rounded-xl px-3 py-2"}>
      <SubTitle className="inline-flex mb-3">Informações adicionais</SubTitle>
      {
        userGroup?.name === "clinical"?
          userData?
          <UserClinicalForm 
            {...{specialties}}
            jsonData={JSON.stringify(userData)} 
          />:
          <UserClinicalForm
            {...{specialties}} 
          />
        :
        <Alert 
          type="warn"
          message="Apenas para usuário clínicos!" 
        />
      }
    </div>
  );
}