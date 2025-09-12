const myMock = jest.fn();

describe("verificação do env do test", () => {
  test("soma", ()=>{
    expect(1+2).toBe(3);
  });

  test("função mockada", async ()=>{
    myMock
    .mockReturnValueOnce(10)
    .mockReturnValueOnce("hello")
    .mockReturnValue({ id: 1, name: "root" });

    expect(await myMock()).toBe(10);
    expect(await myMock()).toBe("hello");
    expect(await myMock()).toEqual({ id: 1, name: "root" });
    expect(myMock).toHaveBeenCalled();
    expect(myMock).toHaveBeenCalledTimes(3);
  });
});