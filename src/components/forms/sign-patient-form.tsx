"use client";

import { 
	useState,
	useRef,
	useEffect,
  useActionState
} from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import tabComponents from "@/components/tab-components";
import clsx from "clsx";
import { signPatient } from "@/backend/api/clinical/api";
import { GrLinkNext } from "react-icons/gr";

import { validatePatientDoc } from "@/lib/regexp";
import { toast } from "react-toastify";

type InputElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export default function SignPatientForm(){
	const [ state, action ] = useActionState(signPatient, { message: '', status: false });
	const formRef = useRef<HTMLFormElement>(null);
	const [ currentTab, setCurrentTab ] = useState(0);
	const router = useRouter();
	
	const goToNextTab = ()=>setCurrentTab(
		tabComponents.length - 1 === currentTab
		? tabComponents.length - 1
		: currentTab+1
	);
	
	const goToTab = (id: number) => setCurrentTab(id);

	const verifyRequiredInputs = ()=>{
		try{
			const elements = formRef.current?.querySelectorAll('[required]') as unknown as InputElement[];
	 
			elements.forEach((element)=>{
				const elementIdValue = element.id.split(':') as string[];

				if(!element.value){
					setCurrentTab(Number(elementIdValue[1]));
					throw new Error(`Preencha o campo ${elementIdValue[0]}`, { cause: "empty"});
				}

				if(elementIdValue.length === 3){
					if(elementIdValue[2] === "documentation" && !validatePatientDoc(element.value)){
						setCurrentTab(Number(elementIdValue[1]));
						throw new Error(`O documento não corresponde a um formato válido!`, { cause: "incorrect"});
					}
				}
			});
	
			formRef.current?.requestSubmit();
		}catch(e: unknown){
			const err = e as Error;
			toast.warn(err.message);
		}
	}

	useEffect(()=>{
		if(state.message)
			if(state.status)
				toast.success(state.message, {
					autoClose: 1500,
					onClose: ()=>{
						router.replace('/clinical/patient');
					}
				});
			else
				toast.error(state.message);
  }, [state, router]);

	return(
		<main>
			<div className="mt-4 mb-6">
				<Header title="Novo Utente" />
			</div>
			
			<Card>
				<form ref={formRef} {...{action}}>
					<div className="grid md:grid-cols-2 lg:flex">
						{tabComponents.map(({ title }, id)=>(
							<button 
								type="button"
								key={id} 
								onClick={()=>goToTab(id)} 
								className={clsx("w-full font-medium text-center px-3 rounded-t-2xl py-2", { 
									"border-primary border-2 border-b-0 text-primary": currentTab === id,
									"text-white bg-primary ": currentTab !== id, 
									})}
								>
									{title}
							</button>
						))}
					</div>

					<div>
						{tabComponents.map(({ children }, i)=>(
							<div key={i} hidden={currentTab === i?false:true}>{children}</div>
						))}
					</div>

					{tabComponents.length - 1 === currentTab && 
						<Button 
							type="button" 
							onClick={verifyRequiredInputs}
						>
							Salvar
						</Button>
					} 
				</form>

				{tabComponents.length - 1 !== currentTab && 
					<Button 
						type="button"
						className="flex gap-3" 
						onClick={goToNextTab}
					>
						Próximo
						<GrLinkNext className="animate-pulse" />
					</Button>
				} 
			</Card>
		</main>
	);
}