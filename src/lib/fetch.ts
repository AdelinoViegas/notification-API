interface Instance {
  url: string;
  base: string;
  headers: Record<string, string>;
}

// Tornamos as propriedades parciais/opcionais para evitar erros ao omitir parâmetros
interface MethodConfig {
  params?: Record<string, string>;
  headers?: Record<string, string>;
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

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} na rota GET ${pathname}`);
    }

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

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Erro desconhecido");
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    return (await response.json()) as T;
  }
}