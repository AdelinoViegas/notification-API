import {
  verify,
  hash
} from 'argon2';
import { isStrongPassword } from 'validator';

export async function encryptPwd(plainText: string){
  return await hash(plainText);
}

export async function decryptPwd(encText: string, plainText: string){
  return await verify(encText, plainText);
}

// requisitos da senha dos usuários
export function passwordValidator(plainText: string){
  return isStrongPassword(plainText, {
    minLength: 1,
    minLowercase: 0,
    minSymbols: 0,
    minNumbers: 0,
    minUppercase: 0,
  });
}