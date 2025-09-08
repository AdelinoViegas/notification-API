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
    updateOne: jest.fn()
  }
}));

describe("Controle de Processos", ()=>{
  test("Sincronização do Id do paciente", async ()=>{
    const pastId = new Types.ObjectId();
    const newId = new Types.ObjectId();
    
    patientSyncModel.findOne
    .mockReturnValueOnce(null)
    .mockReturnValue({ 
      id: pastId, 
      secondaries: [1,2,3].map(()=> new Types.ObjectId()) 
    })

    expect(await syncPatientHistories(pastId, newId)).toBe(true);
    expect(await syncPatientHistories(pastId, new Types.ObjectId())).toBe(true);

    expect(patientSyncModel.findOne).toHaveBeenCalled();
    expect(patientSyncModel.create).toHaveBeenCalled();
    expect(patientSyncModel.updateOne).toHaveBeenCalled();
  });
})