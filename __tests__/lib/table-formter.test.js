import { formater } from "../../src/lib/table-formater";

describe("formatador de tabela", ()=>{
  const data = [
    {
      id: 1,
      name: "root",
      age: 24,
      createdAt: new Date()
    },
    {
      id: 2,
      name: "samurai",
      age: 25,
      createdAt: new Date()
    }
  ];

  test("chamada normal", ()=>{
    const rows = formater(data);

    expect(rows.length).toBe(2);
    
    rows.forEach(ev => {
      expect(ev).toHaveProperty("id");
      expect(ev).toHaveProperty("row");
      expect(ev.row.length).toBe(3);
    });
  });

  test("ordenação das chaves", ()=>{
    const rows = formater(data, {
      order: [ 
        "age", 
        "name", 
        "createdAt" 
    ]});
    
    rows.forEach(ev => {
      expect(typeof ev.row[0] === "string").toBe(true);
      expect(typeof ev.row[1] === "string").toBe(true);
    });
  });

  test("filtro explicito de chaves", ()=>{
    const rows = formater(data, {
      filterKey: [ "id", "name" ]
    });
    
    rows.forEach(ev => {
      expect(ev.row.length).toBe(1);
    });
  });

  test("callback de transformação", ()=>{
    const rows = formater(data, {
      transform: {
        targetKey: "name",
        fn: function(ev){
          return "transformed data "+ev;
        }
      }
    });


    rows.forEach(ev =>{
      expect(ev.row[0]).toMatch(/^transformed data/ig)
    });
  });

  test("lista vazia", ()=>{
    expect(formater([])).toEqual([]);
  });
})