import { patientSyncModel } from "../../src/backend/model";
import { syncPatientHistories } from "../../src/backend/api/clinical/process-control";
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
    deleteOne: jest.fn()
  }
}));

describe("Controle de Processos", ()=>{
  describe("Sincronização do id do paciente", ()=>{
    test("chamada normal", async ()=>{
      const pastId = new Types.ObjectId();
      const newId = new Types.ObjectId();

      const res = await syncPatientHistories(pastId, newId);
      console.log(res);
      expect(patientSyncModel.deleteOne).toHaveBeenCalled();
    });
  });
})