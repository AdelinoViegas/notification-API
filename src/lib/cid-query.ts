const CID_URL="/cid10.json";

export type Cid = {
  code: string;
  value: string;
};

async function getByCode(code: string): Promise<Cid>{
  const data = await (await fetch(CID_URL)).json() as Cid[];
  const cid = data.find((props) => props.code === code);  

  return {
    code: cid?cid?.code: "",
    value: cid?cid.value: "",
  };
}

async function getByName(name: string): Promise<Cid[]>{
  const data = await (await fetch(CID_URL)).json() as Cid[];
  return data.filter((props) => props.value.match(name));
} 

export {
  getByName,
  getByCode
}