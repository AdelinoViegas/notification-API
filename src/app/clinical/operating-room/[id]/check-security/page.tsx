import { CheckSecurity } from "@/components/checklistInOperatingRoom";
import { InternalComponent } from "@/components/global-component";
import { checklistInOperatingRoom } from "@/lib/internal-components";


export default async function Page(){
  const checkList:InternalComponent[] = [ checklistInOperatingRoom() ];

  return(
    <div className="py-4">
      {checkList.map((item, i)=> <CheckSecurity itemId="25" {...item} key={i} />)}
    </div>
  )
}