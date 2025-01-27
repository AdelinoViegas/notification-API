"use client";

import { 
	useState,
	useRef,
	useEffect,
  useActionState
} from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Card from "@/components/card";
import Button from "@/components/ui/button";
import tabComponents from "@/components/tab-components";
import clsx from "clsx";
import Alert from "@/components/alert";
import { signPatient } from "@/app/backend/api/clinical/api";
import { GrLinkNext } from "react-icons/gr";
import { triggerUpdate } from "@/lib/ws-trigger";
import { 
	validatePatientDoc,
	validatePatientLocation 
} from "@/lib/regexp";

type InputElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export default function SignPatientForm(){
	const [ state, action ] = useActionState(signPatient, { message: '', status: false });
	const formRef = useRef<HTMLFormElement>(null);
	const [ currentTab, setCurrentTab ] = useState(0);
	const [ message, setMessage ] = useState("");
	const [ messageState, setMessageState ] = useState(false);
	const router = useRouter();
	const next = ()=>setCurrentTab(tabComponents.length - 1 === currentTab?tabComponents.length - 1:currentTab+1);
	const goToTab = (id: number) => setCurrentTab(id);
	const verifyRequiredInputs = ()=>{
		try{
			const elements = (formRef.current?.querySelectorAll('[required]') as unknown as InputElement[]);
	 
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

					if(elementIdValue[2] === "demography" && !validatePatientLocation(element.value)){
						setCurrentTab(Number(elementIdValue[1]));
						throw new Error("O localização actual não corresponde ao formato válido!", { cause: "incorrect"});
					}
				}
			});
	
			formRef.current?.requestSubmit();
		}catch(e: unknown){
			const err = e as Error;
			setMessage(err.message);
			setMessageState(true);
		}
	}

	useEffect(()=>{
		const id = setTimeout(()=>{ 
			setMessageState(false);
			setMessage("");
			state.message = "";

			clearTimeout(id);
		}, 5000);
	}, [messageState, state]);

	useEffect(()=>{
    setMessageState(true);

    setTimeout(()=>{
      setMessageState(false);

      if(state.status){
				triggerUpdate({ target: "patient" });
				router.replace('/clinical/patient');
			}
    }, state.status?3000:7000);
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
									})}>
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
							onClick={verifyRequiredInputs}>
								Salvar
						</Button>
					} 
				</form>

				{tabComponents.length - 1 !== currentTab && 
					<Button 
						type="button"
						className="flex gap-3" 
						onClick={next}>
							Próximo
							<GrLinkNext />
					</Button>
				} 
				
				{(messageState && message) && 
					<div className="w-96 mt-3">
						<Alert
							type="warn"
							message={message}
						/>
					</div>
				}

				{(messageState && state.message)&& 
					<div className="w-96 mt-3">
						<Alert
							type={state.status?"success":"error"}
							message={state.message}
						/>
					</div>
				}
			</Card>
		</main>
	);
}