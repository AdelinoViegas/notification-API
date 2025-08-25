import { getGrantedUnitAccess,  getUserWorkplaces } from "@/backend/api/clinical/urgency-bank-api";
import UserWorkplaceForm from "@/components/forms/user-workplace-form";

export default async function UserWorkplace({ userId }: { userId: string }){
  const grantedWorkplaces = await getGrantedUnitAccess(userId);
  const workplaces = await getUserWorkplaces();

  return(
    <div>
      <UserWorkplaceForm 
        items={workplaces}
        userItems={grantedWorkplaces}
        userId={userId} 
      />
    </div>
  );
}