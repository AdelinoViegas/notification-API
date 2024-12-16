function validatePatientDoc(docId: string){
  const reg = new RegExp(/(^\d{9}[A-Z]{2}\d{3}$)|(^[A-Z]{2}-\d{4}-\d{4}$)|(^P-\d{8}$)/gi);
  return reg.test(docId);
}

function validatePatientLocation(location: string){
  const reg = new RegExp(/^([\wçÇã]+)\/([\wçÇã]+)\/([\w\d\s-_çÇãé]+)$/gi);
  return reg.test(location);
}

export {
  validatePatientDoc,
  validatePatientLocation
}