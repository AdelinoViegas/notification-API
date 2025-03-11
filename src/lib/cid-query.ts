const CID_URL="/cid10.json";

export type CID = {
  code: string;
  value: string;
};

async function getByCode(code: string): Promise<CID[]>{
  const data = await (await fetch(CID_URL)).json() as CID[];
  const result = data.find(item => item.code === code.trim().toUpperCase());
  return result?[{ code: result?.code, value: result?.value }]:[];
}

async function getByName(name: string): Promise<CID[]>{
  const data = await (await fetch(CID_URL)).json() as CID[];
  return data.filter((props) => props.value.match(name.trim()));
} 

async function getByCodes(codes: string[]): Promise<CID[]>{
  const data = await (await fetch(CID_URL)).json() as CID[];
  const resolved = [];

  for(const code of codes){
    const item = data.find(props => props.code === code) as CID;
    resolved.push(item);
  }
   
  return resolved;
}

export {
  getByName,
  getByCode,
  getByCodes
}