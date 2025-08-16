import { GETpatient } from "@/backend/api/clinical/types";
import { priorityToComponent } from "../backend/api/clinical/translator";

function orderByPriority(dataElements: GETpatient[]){
  const references = [ "red", "orange", "yellow", "green", "blue" ];
  const orderElements = [];
  const summary = [];

  for(const reference of references){
    let count = 0;
    for(const element of dataElements){
      if(priorityToComponent.find((prop)=>prop.label === element.priorityType)?._id === reference){
        orderElements.push(element);
        count++;
      }
    }

    summary.push({
      label: priorityToComponent.find((item)=>item._id === reference)?.label,
      quantity: count,
      id: reference
    });
  }

  summary.push({ label: "Todos", quantity: dataElements.length, id: "white" });

  return {
    orderElements,
    summary,
  };
}

export {
  orderByPriority,
};