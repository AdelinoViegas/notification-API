import { io } from 'socket.io-client';

const WS_URL = process.env.NEXT_PUBLIC_WS_SERVER;

const ws = io(WS_URL);

export type TriggerProps = {
  signal?: string;
  target: "screening" | "urgency-bank" | "patient" | "appointment" | "exams-services" | "schedule-exams" | "office"
  | "laboratory" | "imaging" | "schedule-exams-services" | "permissions" | "phisical-unit"
  | "notification" | "office-exam-results";
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