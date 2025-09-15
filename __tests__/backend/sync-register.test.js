import { syncPatientHistories } from "../../src/backend/api/clinical/process-control";
import { testMock } from "../../src/backend/api/clinical/mock";
beforeEach(() => {
  jest.clearAllMocks();
});

// jest.mock("../../src/backend/model", ()=> ({
//   __esModule: true,
//   patientSyncModel: {
//     findOne: jest.fn(),
//     create: jest.fn(),
//     updateOne: jest.fn(),
//     find: jest.fn()
//   }
// }));

// jest.mock("../../src/backend/api/clinical/process-control", ()=>{
//   const { testMock } = jest.requireActual("../../src/backend/api/clinical/process-control");

//   return {
//     __esModule: true,
//     testMock,
//     syncPatientHistories: jest.fn()
//   }
// });

// describe("Controle de Processos", ()=>{
//   test("test", async ()=>{
//     await testMock("test");
//     expect(syncPatientHistories).toHaveBeenCalled();
//   })
// })

// test/process-control.test.ts

jest.mock("../../src/backend/api/clinical/process-control", () => {
  return {
    __esModule: true,
    syncPatientHistories: jest.fn()
  };
});

test("testMock should call syncPatientHistories", async () => {
  await testMock();
  expect(syncPatientHistories).toHaveBeenCalled();
});
