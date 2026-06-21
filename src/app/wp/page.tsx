import WorkplaceFrom from "@/components/forms/workplace-form";
import { getGrantedUnitAccess } from "@/backend/api/clinical/urgency-bank-api";
import { getMyProfile } from "@/backend/api/admin";
import { FeedbackProvider } from "@/components/feedback/feedback-context";

export const dynamic = "force-dynamic";

export default async function Page(){
  const profile = await getMyProfile();
  const units = await getGrantedUnitAccess(profile.id);
 
  return(
    <FeedbackProvider>
      <WorkplaceFrom units={units} name={profile.fullname} />
    </FeedbackProvider>
  );
}