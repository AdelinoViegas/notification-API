const CID_URL='http://192.168.1.16:3000/cid10.json';

type Cid = {
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
  return data.filter((props) => props.value.startsWith(name));
} 

export {
  getByName,
  getByCode
}