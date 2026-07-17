interface Instance {
  url: string;
  base: string;
  headers: Record<string, string>;
}

// Tornamos as propriedades parciais/opcionais para evitar erros ao omitir parâmetros
interface MethodConfig {
  params?: Record<string, string>;
  headers?: Record<string, string>;
  omit?: { headers: string[]  }
}

type HttpBody = Record<string, unknown> | FormData;

interface Fetch {
  get<T>(pathname: string, config?: MethodConfig): Promise<T>;
  post<T>(pathname: string, body: HttpBody, config?: MethodConfig): Promise<T>;
}

export class FetchService implements Fetch {
  #config: Instance;

  constructor({ url, base, headers }: Instance) {
    this.#config = {
      url: url.replace(/\/$/, ""), // Remove barra no final se houver
      base: base.startsWith("/") ? base : `/${base}`, // Garante barra no início
      headers: {
        "content-type": "application/json",
        ...headers,
      },
    };
  }

  // Helper para criar uma URL isolada e segura por requisição
  #createRequestUrl(pathname: string, params: Record<string, string> = {}): string {
    const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
    const fullPath = `${this.#config.base}${cleanPath}`.replace(/\/+/g, "/"); // Evita barras duplicadas //
    
    const requestUrl = new URL(fullPath, this.#config.url);
    
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        requestUrl.searchParams.set(key, value);
      }
    }
    
    return requestUrl.toString();
  }

  async get<T>(pathname: string, config: MethodConfig = {}): Promise<T> {
    const url = this.#createRequestUrl(pathname, config.params);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        ...this.#config.headers,
        ...config.headers,
      },
    });

    if (!response.ok) 
      return Promise.reject({ 
        status: response.status,
        message: "Falha na conexão!",
        detail: response.statusText
      });

    return (await response.json()) as T;
  }

  async patch<T>(pathname: string, config: MethodConfig = {}): Promise<T> {
    const url = this.#createRequestUrl(pathname, config.params);
    
    const headers = config.omit?.headers 
      ? this.#omitHeaders(config.omit.headers)
      : this.#config.headers;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        ...headers,
        ...config.headers,
      },
    });

    if (!response.ok) 
      return Promise.reject({ 
        status: response.status,
        message: "Falha na conexão!",
        detail: response.statusText
      });

    return (await response.json()) as T;
  }

  async post<T>(pathname: string, body: HttpBody, config: MethodConfig = {}): Promise<T> {
    const url = this.#createRequestUrl(pathname, config.params);
    const isFormData = body instanceof FormData;

    // Se for FormData, REMOVEMOS o content-type para o fetch injetar o boundary nativo
    const requestHeaders = {
      ...this.#config.headers,
      ...config.headers,
    };

    if (isFormData) {
      delete requestHeaders["content-type"]; 
      // Se houver uma versão em caixa alta ou baixa, limpamos ambas
      delete requestHeaders["Content-Type"]; 
    }

    const response = await fetch(url, {
      method: "POST",
      headers: requestHeaders,
      body: isFormData ? body : JSON.stringify(body),
    });

    if(!response.ok)
      return Promise.reject({ 
        status: response.status,
        message: response.status === 502 ? "Internal Service Error" : "Unknown Error",
        detail: response.statusText
      });

    return (await response.json()) as T;
  }

  async put<T>(pathname: string, body: HttpBody, config: MethodConfig = {}): Promise<T> {
    const url = this.#createRequestUrl(pathname, config.params);
    const isFormData = body instanceof FormData;

    // Se for FormData, REMOVEMOS o content-type para o fetch injetar o boundary nativo
    const requestHeaders = {
      ...this.#config.headers,
      ...config.headers,
    };

    if (isFormData) {
      delete requestHeaders["content-type"]; 
      // Se houver uma versão em caixa alta ou baixa, limpamos ambas
      delete requestHeaders["Content-Type"]; 
    }

    const response = await fetch(url, {
      method: "PUT",
      headers: requestHeaders,
      body: isFormData ? body : JSON.stringify(body),
    });
    
    if(!response.ok)
      return Promise.reject({ 
        status: response.status,
        message: response.status === 502 ? "Internal Service Error" : "Unknown Error",
        detail: response.statusText
      });

    return (await response.json()) as T;
  }

  #omitHeaders(headers: string[]){
    const swap: Record<string, string> = {};
    for (const k in this.#config.headers){
      if(headers.includes(k)) continue;
      swap[k] = this.#config.headers[k];
    }

    return swap;
  }
}