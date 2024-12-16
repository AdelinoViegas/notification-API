'use server';

import { accessLimitModel } from "@/app/backend/models/manager";

export async function getUserAccessLimit(userId: string){
  const userAccesLimit = await accessLimitModel.findOne({userId});
  
  if(userAccesLimit && userAccesLimit?.startAt && userAccesLimit?.endAt){
    const restDay = await restOfDayNumbers(
      userAccesLimit.startAt,
      userAccesLimit.endAt
    );

    userAccesLimit['day'] = restDay;

    return userAccesLimit;
  } 
}

export async function addOrUpdateAccessLimit(prev: unknown, formData: FormData){
  try{
    const userId = formData.get('userId');
    const startAt = formData.get('startAt') as string;
    const endAt = formData.get('endAt') as string;
    const update = formData.get('update');

    if(new Date(startAt) > new Date(endAt))
      throw new Error("Intervalos inválidos!");
    
    if(update === "true"){
      await accessLimitModel.findOneAndUpdate({userId}, {
        startAt,
        endAt,
      });

      return {
        message: 'Limite de Acesso actualizado com sucesso!',
        status: true,
      };
    }

    const userAccessLimit = new accessLimitModel({
      userId,
      startAt,
      endAt,
    });

    await userAccessLimit.save();

    return {
      message: 'Limite de Acesso definido com sucesso!',
      status: true,
    };
  }catch(e: unknown){
    const err = e as Error & {code: number};
    if(err.code)
      return {
        message: 'Este usuário já possui um limite de acesso definido!',
        status: false,
      };

    return {
      message: err.message,
      status: false,
    };
  }
}

export async function restOfDayNumbers(startAt: Date, endAt: Date){
  const now = new Date(); 
  const actual = new Date(now.getFullYear(), now.getMonth(), now.getDate()); 

  const start = new Date(startAt.getFullYear(), startAt.getMonth(), startAt.getDate());
  const end = new Date(endAt.getFullYear(), endAt.getMonth(), endAt.getDate());

  if (start < actual) {
    start.setTime(actual.getTime());
  }

  const timeDifference = end.getTime() - start.getTime();
  const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

  return Math.max(0, Math.floor(daysDifference));
}