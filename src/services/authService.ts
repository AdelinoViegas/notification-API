import { request } from "undici";
import type { AuthUser } from "../plugins/auth/types";

export class AuthService {
  constructor(
    private readonly baseUrl: string
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

    async validate(token: string): Promise<void> {
    const { statusCode, body } = await request(
        `${this.baseUrl}/validate`,
        {
        method: "GET",
        headers: {
            authorization: `Bearer ${token}`,
        },
        }
    );

    body.resume();

    console.log("AUTH VALIDATE STATUS:", statusCode);

    if (statusCode !== 200) {
        throw new Error("Token inválido");
    }
    }

  async getUser(token: string): Promise<AuthUser> {
    const { statusCode, body } = await request(
      `${this.baseUrl}/me`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    if (statusCode !== 200) {
      body.resume();
      throw new Error("Usuário não encontrado");
    }

    return await body.json() as AuthUser;
  }

  async authenticate(token: string): Promise<AuthUser> {
    await this.validate(token);

    return this.getUser(token);
  }
}