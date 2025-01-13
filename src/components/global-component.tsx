"use client";

/**
 * 1 - Title do Accordium
 * 2 - Conter components acordiums 
 * 3 - Conter os components de UI (buttons, inputs, textareas, selects, etc)
 * @returns 
 */

import { 
  HTMLInputTypeAttribute, 
  useActionState, 
  useEffect, 
  useState 
} from "react";
import Accordium from "./accordium";
import Button from "./ui/button";
import InputDetails from "./ui/input-details";
import InputField from "./ui/input-field";
import Selection, { SelectionOption } from "./ui/selection";
import Alert from "./alert";

type InitialValue = {
  message?: string;
  status: boolean;
};

type Props = {
  title: string;
  components: InternalComponent[];
};

type TypeUI = HTMLInputTypeAttribute | "select" | "textarea";

export type InternalComponent = {
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
  sectionTitle?: string;
  sectionElements: UIComponent[];
};

function Component({
  title,
  className,
  childrens,
  apiFn,
  initialState
}: InternalComponent){
  const [ state, action ] = useActionState(apiFn?apiFn:FallbackFn, initialState);
  const [ messageState, setMessageState ] = useState(false);
  const closeMessage = ()=> setMessageState(false);

  useEffect(()=>{
    if(state?.message){
      setMessageState(true);
      
      setInterval(()=>setMessageState(false), 3000);
    }
  }, [state]);

  return(
    <Accordium title={title} extraClassName="mt-3">
      <form {...{action}}>
        <div className={className}>
          {childrens.map((item, i)=>(
            <div key={i} className={item.className}>
              {item.sectionElements.map((item, key)=>{
                if(item.type === "select")
                  return(
                    <Selection
                      label={item.props.label}
                      options={item.props.options?item.props.options:[]}
                      defaultValue={item.props.defaultValue}
                    />
                  );
                else if (item.type == "textarea")
                  return(
                    <InputDetails
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
              })}
            </div>
          ))}
        </div>
        <Button>Salvar</Button>

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
  )
}

export default function GlobalComponent({ 
  title, 
  components
}: Props){
  return(
    <Accordium className="hover:bg-primary/35 bg-primary/40" title={title}>
      {components.map((item, i)=> <Component {...item} key={i} />)}
    </Accordium>
  );
}

async function FallbackFn(): Promise<InitialValue> {
  return {
    status: true,
    message: "Isto é apenas um teste!"
  }
}