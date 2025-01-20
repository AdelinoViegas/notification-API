function getDateInSlashFormat(date: Date, lang?: "pt" | "en"){
  return date.toLocaleDateString(lang?lang:'pt');
}

/**
 * @remarks Retorna um formato de hora ANO-MES-DIA
 * @params Date | Number - no formato nativo do JS
 * @returns Retorna a da no formato ANO-MES-DIA
 */
function getDateInDashFormat(date: Date | number){
  if(typeof date === "number"){
    const dateConverted = new Date(date).toISOString().split("T")[0].replace('/', "-");
    return dateConverted; 
  }
  return date.toISOString().split('T')[0].replace('/', "-");
}

function getDataAndHoursFormat(date: Date){
  const timeDate = getDateInSlashFormat(date);
  const hours = `${date.getHours() > 9?date.getHours():"0"+date.getHours()}:${date.getMinutes() > 9?date.getMinutes():"0"+date.getMinutes()}`;
  return `${timeDate} ${hours}`;
}

function getDataToInputLocalTime(date: Date | string){
  if (typeof date === "object")
    return date.toISOString().match(/[\d]{4}-[\d]{2}-[\d]{2}T[\d]{2}:[\d]{2}/ig)?.toString()
  return date.match(/[\d]{4}-[\d]{2}-[\d]{2}T[\d]{2}:[\d]{2}/ig)?.toString()
}

export {
  getDateInSlashFormat,
  getDateInDashFormat,
  getDataAndHoursFormat,
  getDataToInputLocalTime
}