interface Instance {
  url: string;
  base: string;
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

  constructor({ url, base, headers }: Instance){
    this.#config = {
      url,
      base,
      headers: {
        "content-type": "application/json",
        ...headers
      }
    }

    this.#baseUrl = new URL(url);
  }

  async get<T>(
    pathname: string, 
    config: MethodConfig = { params: {}, headers: {} }
  ): Promise<T | ArrayBuffer> {

    this.#baseUrl.pathname = this.#parsePathname([pathname]);
    this.#baseUrl.search = "";
    
    for (const k in config.params)
      this.#baseUrl.searchParams.set(k, config.params[k]);
      
    console.log(this.#baseUrl.toString());

    const data = await fetch(this.#baseUrl.toString(), { 
      headers: { 
        ...this.#config.headers,
        ...config.headers
      }}
    );
    
    if (this.#config.headers["content-type"] !== "application/json"){
      return await data.arrayBuffer();
    }

    console.log(data);

    return {} as T//await data.json() as T;
  }

  async post<T>(
    pathname: string, 
    body: HttpBody, 
    config: MethodConfig = { params: {}, headers: {} }
  ): Promise<T> {
    this.#baseUrl.pathname = this.#parsePathname([pathname]);
    this.#baseUrl.search = "";
    
    for (const k in config.params)
      this.#baseUrl.searchParams.set(k, config.params[k]);

    const headers = body instanceof FormData 
      ? { ...this.#config.headers, ...config.headers, "content-type": "multipart/form-data" }
      : { ...this.#config.headers, ...config.headers }

    const data = await fetch(this.#baseUrl.toString(), { 
      method: "POST",
      headers,
      body: body instanceof FormData 
        ? body
        : JSON.stringify(body),
    });
    
    console.log(await data.text());

    return { } as T//await data.json() as T;
  }

  #parsePathname(chunks: string[]){
    return [this.#config.base, ...chunks].join("");
  }
}