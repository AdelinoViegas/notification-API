import { syncPatientHistories } from "@/backend/api/clinical/process-control";

// exemplo de função que tem dependencia de outra fn, para pode ser testada usando qualquer test runner
export async function testMock(id: string){
  await syncPatientHistories(id, "test");
}