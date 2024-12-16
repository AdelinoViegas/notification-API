import { Tooltip } from "react-tooltip";

function SimpleTooltip({
  id,
  content
}: { 
  id?: string;
  content: string; 
}){
  return <Tooltip id={id} content={content} />
}

export {
  SimpleTooltip
}