"use client";

import { 
  HTMLInputTypeAttribute, 
  useActionState, 
  useEffect
} from "react";
import { useRouter } from "next/navigation";
import Accordium from "@/components/ui/accordium";
import Button from "@/components/ui/button";
import InputDetails from "@/components/ui/input-details";
import InputField from "@/components/ui/input-field";
import Selection, { SelectionOption } from "@/components/ui/selection";
import ComboBox from "@/components/ui/combobox";
import { toast } from 'react-toastify';

type InitialValue = {
  message?: string;
  status: boolean;
  isWarn?: boolean;
};

type SeparatedElements = {
  label: string;
  className?: string;
  elements: UIComponent[];
}

type Props = {
  title: string;
  components: InternalComponent[];
  itemId?: string;
};

type TypeUI = HTMLInputTypeAttribute | "select" | "textarea" | "combobox";

type InternalComponent = {
  title: string;
  childrens: Children[];
  className?: string;
  sections?: string[];
  apiFn?: (prev:unknown, formData:FormData)=>Promise<InitialValue>;
  initialState?: InitialValue;
  itemId?: string;
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
    defaultChecked?: boolean;
    onChange?: (e: unknown)=>void; 
  };
};

type Children = {
  className?: string;
  elements: UIComponent[];
  separatedElements?: SeparatedElements[];
};

function Component({
  itemId,
  title,
  className,
  childrens,
  apiFn,
  initialState
}: InternalComponent){
  const [ state, action ] = useActionState(apiFn?apiFn:FallbackFn, initialState);
  const router = useRouter();
  
  useEffect(()=>{
    if(state?.message){
      if(state.status)
        toast.success(state.message, {
          onClose: router.refresh,
          autoClose: 1500
        });
      else 
        if(state?.isWarn)
          toast.warn(state.message);
        else
          toast.error(state.message);
    }
  }, [state, router]);

  return(
    <Accordium title={title} extraClassName="mt-3">
      <form {...{action}}>
        <input
          className="hidden"
          name="patientId"
          defaultValue={itemId}
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

        <Button>Salvar</Button>
      </form>
    </Accordium>
  );
}

export default function GlobalComponent({ 
  itemId,
  title, 
  components
}: Props){
  return(
    <Accordium className="bg-gray-200 hover:bg-gray-300" title={title}>
      {components.map((item, i)=> <Component {...{itemId}} {...item} key={i} />)}
    </Accordium>
  );
}

export function RenderUIElement({ items }: { items: UIComponent[]}){
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
    else if (item.type === "textarea")
      return(
        <InputDetails
          key={key}
          textLabel={item.props.label}
          {...item.props} 
        />
      )
    else if (item.type === "combobox")
      return(
        <ComboBox key={key} defaultValue={item.props.defaultValue as string} />
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

// função de fallback
async function FallbackFn(): Promise<InitialValue> {
  return {
    status: true,
    message: "Isto é apenas um teste!"
  }
}

export type {
  InternalComponent,
  Children,
  UIComponent,
  SeparatedElements
};