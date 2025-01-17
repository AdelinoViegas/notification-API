"use client";

import { 
  HTMLInputTypeAttribute, 
  useActionState, 
  useEffect, 
  useState 
} from "react";
import Accordium from "@/components/accordium";
import Button from "@/components/ui/button";
import InputDetails from "@/components/ui/input-details";
import InputField from "@/components/ui/input-field";
import Selection, { SelectionOption } from "@/components/ui/selection";
import Alert from "@/components/alert";
import { useRouter } from "next/navigation";

type InitialValue = {
  message?: string;
  status: boolean;
};

type SeparatedElements = {
  label: string;
  className?: string;
  elements: UIComponent[];
}

type Props = {
  patientId: string;
  title: string;
  components: InternalComponent[];
};

type TypeUI = HTMLInputTypeAttribute | "select" | "textarea";

type InternalComponent = {
  title: string;
  childrens: Children[];
  className?: string;
  sections?: string[];
  apiFn?: (prev:unknown, formData:FormData)=>Promise<InitialValue>;
  initialState?: InitialValue;
};

type UIComponent = {
  type: TypeUI;
  props: {
    label: string;
    name: string;
    placeholder?: string;
    defaultValue?: string | number;
    rows?: number;
    options?: SelectionOption[];
  };
};

type Children = {
  className?: string;
  elements: UIComponent[];
  separatedElements?: SeparatedElements[];
};

function Component({
  patientId,
  title,
  className,
  childrens,
  apiFn,
  initialState
}: InternalComponent & {patientId : string}){
  const [ state, action ] = useActionState(apiFn?apiFn:FallbackFn, initialState);
  const [ messageState, setMessageState ] = useState(false);
  const [ isEdit, setIsEdit ] = useState(false)
  const router = useRouter();

  useEffect(()=>{
    if(state?.message){
      setMessageState(true);
      setTimeout(()=>setMessageState(false), 3000);
      router.refresh();
    }
  }, [state, router]);

  return(
    <Accordium title={title} extraClassName="mt-3">
      <form {...{action}}>
        <input
          className="hidden"
          name="patientId"
          defaultValue={patientId}
        />

        <div className={className}>
          {childrens.map((item, i)=>(
            <div key={i} className={item.className}>
              <RenderUIElement items={item.elements} />

              { !!item.separatedElements &&
                item.separatedElements.map((item, index)=>(
                  <div className={item.className} key={index}>
                    <p className="font-medium text-sm">{item.label}: </p>
                    <RenderUIElement items={item.elements} />
                  </div> 
                ))
              }
            </div>
          ))}
        </div>

        {/*<Button>Salvar</Button>*/}
        {/*<div className="flex gap-3">
          { hasData && 
          <Button 
            cancel={!isEdit} 
            type="button" 
            onClick={!isEdit?disableEdit:()=>setIsEdit(false)}>
            {!isEdit?"Cancelar":"Editar"}
          </Button>}
          <Button disabled={isEdit}>{hasData?"Actualizar":"Salvar"}</Button>
        </div>*/}

        {
          state?.message && messageState &&
          <div className="flex mt-3">
            <Alert
              type={state?.status?'success':'error'}
              message={state?.message}
            />
          </div>
        }
      </form>
    </Accordium>
  );
}

export default function GlobalComponent({
  patientId, 
  title, 
  components
}: Props){
  return(
    <Accordium className="hover:bg-primary/35 bg-primary/40" title={title}>
      {components.map((item, i)=> <Component {...{patientId}} {...item} key={i} />)}
    </Accordium>
  );
}
// função de fundo dos components, caso ainda n tenha um função de backend para preencher
async function FallbackFn(): Promise<InitialValue> {
  return {
    status: true,
    message: "Isto é apenas um teste!"
  }
}

function RenderUIElement({ items }: { items: UIComponent[] }){
  return items.map((item, key)=>{
    if(item.type === "select")
      return(
        <Selection
          key={key}
          label={item.props.label}
          options={item.props.options?item.props.options:[]}
          defaultValue={item.props.defaultValue}
        />
      );
    if(item.type === "radio" || item.type === "checkbox")
      return(
        <InputField 
          key={key}
          type={item.type}
          textLabel={item.props.label}
          {...item.props} 
        />
      );
    else if (item.type === "textarea")
      return(
        <InputDetails
          key={key}
          textLabel={item.props.label}
          {...item.props} 
        />
      )
    else
      return(
        <InputField
          key={key}
          textLabel={item.props.label}
          type={item.type}
          {...item.props}
        />
      );
  })
}

export type {
  InternalComponent,
  Children,
  UIComponent,
  SeparatedElements
};