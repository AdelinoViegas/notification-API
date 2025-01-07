/**
 * 1 - Title do Accordium
 * 2 - Conter components acordiums 
 * 3 - Conter os components de UI (buttons, inputs, textareas, selects, etc)
 * @returns 
 */

import Accordium from "./accordium";
import Button from "./ui/button";
import InputDetails from "./ui/input-details";
import InputField from "./ui/input-field";
import Selection from "./ui/selection";

type Props = {
  title: string;
  components: InternalComponent[];
};

type TypeUI = "input" | "button" | "select" | "checkbox" | "textarea" | "radio";

export type InternalComponent = {
  title: string;
  childrens: Children[];
  className?: string;
  sections?: string[];
};

type UIComponent = {
  type: TypeUI;
  props: {
    label: string;
    name: string;
    placeholder?: string;
    defaultValue?: string;
  };
};

type Children = {
  className?: string;
  sectionTitle?: string;
  sectionElements: UIComponent[];
};

export default function GlobalComponent({ title, components }: Props){
  return(
    <Accordium className="hover:bg-primary/35 bg-primary/40" title={title}>
      {components.map((item, key)=>(
        <Accordium title={item.title} key={key}>
          <form>
            <div className={item.className}>
              {item.childrens.map((item, key)=>(
                <div key={key} className={item.className}>
                  {item.sectionElements.map((item, key)=>{
                    switch(item.type){
                      case "input":
                        return(
                          <InputField
                            key={key}
                            textLabel={item.props.label}
                            {...item.props}
                          />
                        );
                      case "textarea":
                        return(
                          <InputDetails
                            key={key}
                            textLabel={item.props.label}
                            {...item.props}
                          />
                        );
                      case "radio":
                        return(
                          <InputField
                            key={key}
                            type="radio"
                            textLabel={item.props.label}
                            {...item.props}
                          />
                        );
                      case "select":
                        return(
                          <InputField
                            key={key}
                            type="radio"
                            textLabel={item.props.label}
                            {...item.props}
                          />
                        );
                    }
                  })}
                </div>
              ))}
            </div>
            <Button>Salvar</Button>
          </form>
        </Accordium>
      ))}
    </Accordium>
  );
}