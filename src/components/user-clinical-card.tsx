import SubTitle from "@/components/ui/subtitle";
import UserClinicalForm from "@/components/forms/user-clinical-form";
import { 
  getUser as getClinicalUser, 
  getSpecialties 
} from "@/app/backend/api/clinical/api";

export default async function UserClinicalCard({
  userId,
  className
}:{
  userId: string;
  className?: string;
}){
  const specialties = await getSpecialties();
  const clinicalUser = await getClinicalUser(userId);
  
  return(
    <div className={className?className:"border bg-white rounded-xl px-3 py-2"}>
      <SubTitle className="inline-flex mb-3">Informações do Profissional</SubTitle>
      <UserClinicalForm
        {...{specialties}}
        jsonData={clinicalUser?JSON.stringify(clinicalUser):undefined}
      />
    </div>
  );
}