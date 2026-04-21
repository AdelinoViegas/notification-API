import { patientSyncModel, processStateModel } from "../../src/backend/model";
import { 
  openPatientProcess,
  syncPatientHistories, 
  getSyncedHistories
} from "../../src/backend/api/clinical/process-control";
import { Types } from "mongoose";

jest.mock("../../src/lib/web-token", ()=> ({
  __esModule: true,
  getUserId: jest.fn(),
}));

jest.mock("../../src/backend/api/admin", ()=> ({
  __esModule: true,
  getUser: jest.fn(),
}));

jest.mock("../../src/components/userbar", ()=> ({
  __esModule: true,
  getFirstAndLastName: jest.fn(),
}));

beforeAll(() => {
  jest.clearAllMocks();
});

jest.mock("../../src/backend/model", ()=> ({
  __esModule: true,
  processStateModel: {
    findOneAndUpdate: jest.fn(),
    findOne: jest.fn(),
  },
  patientSyncModel: {
    findOne: jest.fn(),
    create: jest.fn(),
    updateOne: jest.fn(),
    find: jest.fn()
  }
}));

import { getUserId } from "../../src/lib/web-token";
import { getUser } from "../../src/backend/api/admin";
import { getFirstAndLastName } from "../../src/components/userbar";

describe("Controle de Processos", ()=>{
  test("Abertura atómica do processo", async ()=>{
    const patientId = new Types.ObjectId().toString();
    const userId = new Types.ObjectId().toString();

    getUserId.mockResolvedValue(userId);
    processStateModel.findOneAndUpdate.mockResolvedValue({ value: { patientId, userId, isInUse: true } });

    const result = await openPatientProcess(patientId, "urgency");

    expect(result).toEqual({
      message: "Processo aberto com sucesso!",
      status: true,
    });
    expect(processStateModel.findOneAndUpdate).toHaveBeenCalledWith({
      patientId,
      location: "urgency",
      $or: [
        { isInUse: false },
        { userId },
      ]
    }, {
      $set: {
        isInUse: true,
        userId,
      },
      $setOnInsert: {
        patientId,
        location: "urgency",
      }
    }, {
      new: true,
      upsert: true,
      rawResult: true,
    });
  });

  test("Bloqueio concorrente por outro utilizador", async ()=>{
    const patientId = new Types.ObjectId().toString();
    const currentUserId = new Types.ObjectId().toString();
    const lockOwnerId = new Types.ObjectId().toString();

    getUserId.mockResolvedValue(currentUserId);
    processStateModel.findOneAndUpdate.mockRejectedValue({ code: 11000 });
    processStateModel.findOne.mockResolvedValue({
      patientId,
      userId: lockOwnerId,
      location: "urgency",
      isInUse: true,
    });
    getUser.mockResolvedValue({ fullname: "Maria Silva" });
    getFirstAndLastName.mockReturnValue("Maria Silva");

    const result = await openPatientProcess(patientId, "urgency");

    expect(result).toEqual({
      message: "Processo ocupado pelo Sr(a).Maria Silva!",
      status: false,
    });
  });

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