"use client";

import { useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Selection, { type SelectionOption } from "@/components/ui/selection";
import { enterIntoWorkplace } from "@/backend/api/clinical/workplace-api";
import { toast } from "react-toastify";
import FeedbackLogoutButton from '@/components/feedback/feedback-logout-button';
import Image from "next/image";
import Carousel from "@/components/carousel";

interface Props {
  units: SelectionOption[];
  name: string;
}

export default function WorkplaceForm(params: Props) {
  const [state, action, isPending] = useActionState(enterIntoWorkplace, { message: "", status: false });
  const router = useRouter();

  useEffect(() => {
    if (state.message) {
      if (state.status) {
        router.replace("/clinical");
        return;
      }
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <div className="flex flex-col md:flex-row p-3 md:p-0 md:gap-x-3">
      <div className="hidden md:block w-3/5 h-full overflow-hidden rounded-r-xl">
        <Carousel url={[ "/slides/1.jpg", "/slides/2.jpg" ]} />
      </div>

      <div className="md:flex md:grow md:flex-col md:justify-center md:items-center">
        <MasterLogo />
        <h2 className="my-3">Seja bem vindo(a) <span className="font-bold capitalize">{params.name}</span></h2>

        <form action={action} className="w-96">
          {params.units.length >= 2 && (
            <Selection
              label="Área de trabalho"
              options={params.units}
              name="workplaceId"
              required
            />
          )}

          {params.units.length === 1 && (
            <input type="hidden" name="workplaceId" value={params.units[0]._id} />
          )}

          <div className="space-y-2">
            <Button 
              className="w-full" 
              disabled={isPending}
            >
              {isPending ? "Processando..." : "Continuar"}
            </Button>

            <FeedbackLogoutButton className="flex items-center bg-red-500 text-white p-2 rounded-lg w-full justify-center" />
          </div>
        </form>
      </div>
    </div>
  );
}


function MasterLogo(){
  return (
    <div className="flex gap-x-3 items-center bg-primary/25">
      <Image 
        width={500}
        height={500}
        src="/banner.png"
        alt='MASTER ERP LOGO' 
        className='size-16'
      /> 

      <div>
        <h2 className='text-xl md:text-3xl uppercase font-semibold font-sans'>Master ERP<span className='text-sm'>&reg;</span></h2>
        <p>Sistema Integrado de Gestão</p>
      </div>
    </div>
  );
}