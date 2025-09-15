import { syncPatientHistories } from "../../src/backend/api/clinical/process-control";
import { testMock } from "../../src/backend/api/clinical/mock";

beforeEach(() => {
  jest.clearAllMocks();
});

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
