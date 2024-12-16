import { io } from 'socket.io-client';

const WS_URL='ws://192.168.1.16:3001';

const ws = io(WS_URL);

// type NOTIFICATIONO_SIGNAL = {
//   ""
// }

export type TriggerProps = {
  signal?: string;
  target: "screening" | "urgency-bank" | "patient" | "appointment" | "exams-services" | "schedule-exams" | "office"
  | "laboratory" | "imaging" | "schedule-exams-services" | "permissions" | "phisical-unit"
  | "notification";
  callback?: ()=>void;
};

function triggerUpdate({ 
  target, 
  signal 
}: TriggerProps){
  ws.send(target, signal);  
}
export {
  triggerUpdate,
  WS_URL
}