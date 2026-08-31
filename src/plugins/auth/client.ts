import type { AuthUser } from "./types";

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 401
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export class AuthClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async validate(token: string): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/validate`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new AuthError("Token inválido", 401);
    }
  }

  async getMe(token: string): Promise<AuthUser> {
    const response = await fetch(
      `${this.baseUrl}/me`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new AuthError("Não foi possível identificar o usuário", 401);
    }

    const user = await response.json() as AuthUser;

    if (!user.id || typeof user.id !== "string") {
      throw new AuthError("Identidade do usuário inválida", 401);
    }

    return user;
  }

  async authenticate(token: string): Promise<AuthUser> {
    await this.validate(token);

    return this.getMe(token);
  }
}