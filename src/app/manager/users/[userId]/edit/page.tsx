import { getUser } from '@/app/backend/api/manager/api';
import Header from '@/components/header';
import UserForm from '@/components/forms/user-form';

export default async function Page({
  params
}:{ 
  params: Promise<{
    userId: string;
  }>
}){
  const { userId } = await params;
  const user = await getUser(userId);
 
  return(
    <main className="px-2 pt-4 w-full">
      <Header className='mb-3' title='Editar Informações Pessoais' />
      <UserForm jsonData={JSON.stringify(user)} />
    </main>
  )
}