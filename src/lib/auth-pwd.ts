import {
  verify,
  hash
} from 'argon2';

async function encryptPwd(plainText: string){
  return await hash(plainText);
}

async function decryptPwd(encText: string, plainText: string){
  return await verify(encText, plainText);
}

function passwordValidator(plainText: string){
  return !!plainText;
}

export {
  encryptPwd,
  decryptPwd,
  passwordValidator
}