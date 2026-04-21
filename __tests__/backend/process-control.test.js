import { patientSyncModel } from "../../src/backend/model";
import { 
  syncPatientHistories, 
  getSyncedHistories
} from "../../src/backend/api/clinical/process-control";
import { Types } from "mongoose";

beforeAll(() => {
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

  test("Lista de historicos de id's do paciente", async ()=>{
    const id = new Types.ObjectId();
    const histories = {
      id,
      secondaries: [1,2,3].map(()=>new Types.ObjectId()),
    };
    
    patientSyncModel.findOne
    // .mockReturnValueOnce({
    //   select: jest.fn().mockResolvedValue(null)
    // })
    .mockReturnValue({
      select: jest.fn().mockResolvedValue(histories)
    });

    patientSyncModel.find
    .mockReturnValueOnce({ 
      select: jest.fn().mockResolvedValue([histories])
    })
    .mockReturnValue({
      select: jest.fn().mockResolvedValue([])
    });

    // expect(await getSyncedHistories(new Types.ObjectId())).toBeNull(); // erro
    expect(await getSyncedHistories(id)).toEqual(histories);
  });
})