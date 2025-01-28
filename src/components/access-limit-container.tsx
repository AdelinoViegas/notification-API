import { clsx } from "clsx";
import { getUserAccessLimit } from "@/lib/access-limit";
import SubTitle from "@/components/ui/subtitle";
import AccessLimitForm from "@/components/forms/access-limit-form";
import { 
  getUserGroup, 
  getUser 
} from "@/app/backend/api/manager/api";
import Alert from "@/components/ui/alert";

export default async function AccessLimitContainer({
  userId
}: {
  userId: string;
}){

  const userAccessLimit = await getUserAccessLimit(userId);
  const startAt = userAccessLimit?.startAt?String(userAccessLimit.startAt):undefined;
  const endAt = userAccessLimit?.endAt?String(userAccessLimit.endAt):undefined;
  const user = await getUser(userId, true);
  const userGroup = await getUserGroup(user.userGroupId as string);
  const isAdmin = userGroup? userGroup.name === 'administrator': false;

  return(
    <div className="bg-white px-3 py-2 rounded-xl border space-y-2">
      <SubTitle className="inline-flex">Limites de Acesso</SubTitle>
        { !!userAccessLimit?.day && <div className={clsx("inline-flex px-3 mt-3 py-1 rounded-xl",
          {
            "bg-green-200 text-green-900 font-medium": userAccessLimit.day > 15,
            "bg-orange-200 text-orange-900 font-medium": userAccessLimit.day <= 15 && userAccessLimit.day > 5,
            "bg-red-200 text-red-900 font-medium": userAccessLimit.day <= 5,

          })}>
          <p>Este usuário tem <strong>{userAccessLimit.day}</strong> dias de acesso</p>
        </div>}

        { userAccessLimit?.day === 0 && 
          <Alert 
            type="warn" 
            message="Usuário atingiu o limite de acesso!" 
          />
        }
        <AccessLimitForm
          {...{userId}}
          {...{startAt}}
          {...{endAt}}
          {...{isAdmin}}
        />
    </div>
  )
}