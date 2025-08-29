import { GETpatient } from "@/backend/api/clinical/types";
import { priorityToComponent, surgerySchedulingArea } from "@/backend/api/clinical/translator";
import { ScheduleSugery } from "./table-formater";

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

function priorityInOperatingRoom(dataElements: ScheduleSugery[]){
  const reference = [ "red", "orange", "yellow", "green",];
  const orderElements = [];
  const areasToSchedule = [];

  for(const area of reference){
    let count = 0;
    for(const element of dataElements){
      if(surgerySchedulingArea.find((prop)=>prop.label === element.requestingService)?.color === area){
        orderElements.push(element);
        count++;
      }
    }

    areasToSchedule.push({
      label: surgerySchedulingArea.find((item)=>item.color === area)?.label,
      quantity: count,
      id: area
    });
  }

  areasToSchedule.push({ label: "Todos", quantity: dataElements.length, id: "white" });

  return {
    orderElements,
    areasToSchedule,
  };
}

export {
  orderByPriority,
  priorityInOperatingRoom,
};