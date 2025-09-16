type FormaterData = { [index: string ]: string }

type FormaterOptions = {
  order?: string[]; 
  transform?: {
    targetKey: string;
    fn(arg: string): string
  },
  filterKey?: string[]; 
}

export function formater(data: unknown[], options?:FormaterOptions){
  try{
    const keys = [];
    const controller = new Map<string, null>();
    const rows = [];

    for (const key in data[0] as object){
      if(options?.filterKey?.length){
        if(!options.filterKey.includes(key))
          continue;

        keys.push(key);
      }else
        keys.push(key);
    }
     
    if(options?.order){
      if(options.order.includes("id"))
        throw new Error("[-] remova da order a chave 'id'!");
      
      if(options.order.length !== keys.slice(1).length)
        throw new Error("[-] chaves em falta!\n".concat(JSON.stringify({ 
          original: {
            length: keys.length,
            comment: "menos 1 porque o id não se conta",
            keys
          }, 
          order: {
            length: options.order.length,
            keys: options.order
          } 
        }, null, 2))); 

      for(const k of options.order){
        if(!keys.slice(1).includes(k)){
          console.log("chaves validas: ", keys.slice(1));
          throw new Error("[-] a chave "+k+" não existe nos dados");
        }
      }
    }

    if(options?.transform){
      if(!keys.slice(1).includes(options.transform.targetKey)){
        console.log("[!] chaves validas para o 'order': ", keys.slice(1));
        throw new Error(`[-] a chave ${options.transform.targetKey} não existe!`); 
      }
    }
    
    const dataKeys = options?.order ??  keys.slice(1);

    if(!keys.includes("id")){
      throw new Error("[-] a chave 'id' não foi encontrado na estruturada de dados original");
    }
    
    for(const i of data as FormaterData[])
      for (const _ in i){
        const row = {
          id: i["id"],
          row: dataKeys.map(k => {
            if(options?.transform)
              if(options.transform.targetKey === k)
                return options.transform.fn(i[k])?.toString();

            return i[k].toString();
          })
        };
        
        if(controller.has(row.id))
          continue;

        controller.set(row.id, null);
        rows.push(row);
      }

    return rows;
  } catch (e) {
    const err = e as Error;
    console.error(err.message);
    return [];
  }
}

export function angolaCurrency(money: number | string){
  return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(
    money as number,
  );
}
