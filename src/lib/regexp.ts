export function validatePatientDoc(docId: string){
  const reg = new RegExp(/(^\d{9}[A-Z]{2}\d{3}$)|(^[A-Z]{2}-\d{4}-\d{4}$)|(^P-\d{8}$)/gi);
  return reg.test(docId);
}

export function inferRegexPattern(str: string): string {
  if (!str) return "";

  const mapChar = (ch: string) => {
    if (/[A-Z]/.test(ch)) return "[A-Z]";
    if (/[a-z]/.test(ch)) return "[a-z]";
    if (/[0-9]/.test(ch)) return "[0-9]";
    return "\\" + ch; // escapa caractere especial literal
  };

  const result: string[] = [];
  let last: string | null = null;
  let count = 0;

  for (const ch of str) {
    const token = mapChar(ch);

    if (token === last) {
      count++;
    } else {
      if (last !== null) {
        if (last === "[0-9]") {
          result.push(`${last}+`);
        } else {
          result.push(count > 1 ? `${last}{${count}}` : last);
        }
      }
      last = token;
      count = 1;
    }
  }

  // adiciona o último bloco
  if (last !== null) {
    if (last === "[0-9]") {
      result.push(`${last}+`);
    } else {
      result.push(count > 1 ? `${last}{${count}}` : last);
    }
  }

  return `^${result.join("")}$`;
}
