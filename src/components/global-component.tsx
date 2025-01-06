/**
 * 1 - Title do Accordium
 * 2 - Conter components acordiums 
 * 3 - Conter os components de UI (buttons, inputs, textareas, selects, etc)
 * @returns 
 */

import Accordium from "./accordium";
import InputDetails from "./ui/input-details";
import InputField from "./ui/input-field";

type Props = {
  title: string;
  components: InternalComponent[];
};

type TypeUI = "input" | "button" | "select" | "checkbox" | "textarea";

export type InternalComponent = {
  title: string;
  childrens: Children[];
  className?: string;
  sections?: string[];
};

type Children = {
  type: TypeUI;
  elementProps: {
    label: string;
    name: string;
    placeholder?: string;
    defaultValue?: string;
  };
}

export default function GlobalComponent({ components }: Props){
  return(
    <Accordium title="test">
      {components.map((item, key)=>(
        <Accordium title="test" key={key}>
          <div className={item.className}>
            {item.childrens.map((item, key)=>{
              switch(item.type){
                case "textarea": return <InputDetails key={key} textLabel="test" />;
                case "input": return <InputField textLabel="test" />;
              }
            })}
          </div>
        </Accordium>
      ))}
    </Accordium>
  );
}