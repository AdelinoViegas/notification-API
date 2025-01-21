import LoginForm from "@/components/forms/login-form";
export const dynamic = "force-dynamic";

export default function Page(){ 
  return(
   <main className="h-screen bg-[url(/background.webp)] bg-no-repeat bg-cover bg-center flex justify-center items-center">
    <LoginForm />
   </main>
  );
}