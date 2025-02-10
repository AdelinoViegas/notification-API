const CID_URL="/cid10.json";

export type CID = {
  code: string;
  value: string;
};

async function getByCode(code: string): Promise<CID[]>{
  const data = await (await fetch(CID_URL)).json() as CID[];
  const result = data.find(item => item.code === code);
  return result?[{ code: result?.code, value: result?.value }]:[];
  return data.filter((props) => props.code === code.toUpperCase());  
}

async function getByName(name: string): Promise<CID[]>{
  const data = await (await fetch(CID_URL)).json() as CID[];
  return data.filter((props) => props.value.match(name));
} 

export {
  getByName,
  getByCode,
}