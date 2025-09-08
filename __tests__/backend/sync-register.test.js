import { patientSyncModel } from "../../src/backend/model";
import { 
  syncPatientHistories, 
  testMock
} from "../../src/backend/api/clinical/process-control";
import { Types } from "mongoose";

beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock("../../src/backend/model", ()=> ({
  __esModule: true,
  patientSyncModel: {
    findOne: jest.fn(),
    create: jest.fn(),
    updateOne: jest.fn(),
    find: jest.fn()
  }
}));

jest.mock("../../src/backend/api/clinical/process-control", ()=>{
  const { testMock } = jest.requireActual("../../src/backend/api/clinical/process-control");

  return {
    __esModule: true,
    testMock,
    syncPatientHistories: jest.fn()
  }
});

describe("Controle de Processos", ()=>{
  test("test", async ()=>{
    await testMock("test");
    expect(syncPatientHistories).toHaveBeenCalled();
  })
})