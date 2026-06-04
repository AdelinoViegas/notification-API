interface Instance {
  baseUrl: string;
  headers: {
    [key: string]: string;
  }
}

interface MethodConfig {
  params: {
    [n: string]: string;
  },
  headers: {
    [n: string]: string;
  }
}

type HttpBody = { [k: string]: string } | FormData;

interface Fetch {
  get<T>(pathname: string, config: MethodConfig): Promise<T | ArrayBuffer>;
  post<T>(pathname: string, body: HttpBody, config: MethodConfig): Promise<T>;
}

export class FetchService implements Fetch {
  #config: Instance;
  #baseUrl: URL;

  constructor({ baseUrl, headers }: Instance){
    this.#config = {
      baseUrl,
      headers: {
        "content-type": "application/json",
        ...headers
      }
    }

    this.#baseUrl = new URL(baseUrl);
  }

  async get<T>(
    pathname: string, 
    config: MethodConfig = { params: {}, headers: {} }
  ): Promise<T | ArrayBuffer> {
    this.#baseUrl.pathname = pathname;
    this.#baseUrl.search = "";
    
    for (const k in config.params)
      this.#baseUrl.searchParams.set(k, config.params[k]);
      
    const data = await fetch(this.#baseUrl.toString(), { headers: this.#config.headers });
    
    if (this.#config.headers["content-type"] !== "application/json"){
      return await data.arrayBuffer();
    }

    this.#log({ headers: JSON.stringify(this.#config.headers)});

    return await data.json() as T;
  }

  async post<T>(
    pathname: string, 
    body: HttpBody, 
    config: MethodConfig = { params: {}, headers: {} }
  ): Promise<T>{
    this.#baseUrl.pathname = pathname;
    this.#baseUrl.search = "";
    
    for (const k in config.params)
      this.#baseUrl.searchParams.set(k, config.params[k]);
    
    const data = await fetch(this.#baseUrl.toString(), { 
      method: "POST",
      headers: {
        ...this.#config.headers,
        ...config.headers
      },
      body: body instanceof FormData 
        ? body
        : JSON.stringify(body),
    });
    
    this.#log({ headers: JSON.stringify(data.headers)});

    return await data.json() as T;
  }

  // async postFile<T>(
  //   pathname: string, 
  //   body: unknown, 
  //   config: MethodConfig = { params: {}, headers: {} }
  // ): Promise<T | unknown>{
  //   this.#baseUrl.pathname = pathname;
  //   this.#baseUrl.search = "";
    
  //   for (const k in config.params)
  //     this.#baseUrl.searchParams.set(k, config.params[k]);
      
  //   const data = await fetch(this.#baseUrl.toString(), { 
  //     method: "POST",
  //     headers: {
  //       ...this.#config.headers,
  //       ...config.headers,
  //     },
  //   });
    
  //   this.#log();

  //   if (this.#config.headers["content-type"] !== "application/json"){
  //     return await data.arrayBuffer();
  //   }

  //   return await data.json() as T;
  // }

  #log({ headers }: { headers: string }){
    console.log({ 
      url: this.#baseUrl.toString(),
      headers: JSON.parse(headers)
    });
  }
}