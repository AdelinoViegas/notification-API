const CID_URL="/cid10.json";

export type CID = {
  code: string;
  value: string;
};

async function getCid(): Promise<CID[]>{
  return await (await fetch(CID_URL)).json() as CID[];
}

export async function getByCode(code: string): Promise<CID[]>{
  const data = await getCid();
  const result = data.find(item => item.code === code.trim().toUpperCase());
  return result?[{ code: result?.code, value: result?.value }]:[];
}

export async function getByName(name: string): Promise<CID[]>{
  const data = await getCid();
  return data.filter((props) => props.value.match(name.trim()));
} 

export async function getByCodes(codes: string[]): Promise<CID[]>{
  const data = await getCid();
  const resolved = [];

  for(const code of codes){
    const item = data.find(props => props.code === code) as CID;
    resolved.push(item);
  }
   
  return resolved;
}