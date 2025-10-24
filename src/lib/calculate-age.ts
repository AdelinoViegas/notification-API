export function calculateAge(birthDate: string | Date){
  const date = new Date(birthDate);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();
  const yearOfBirth = date.getFullYear();
  const monthOfBirth = date.getMonth() + 1;
  const dayOfBirth = date.getDate();

  if(currentYear === yearOfBirth){
    if(currentMonth === monthOfBirth)
      if(currentDay === dayOfBirth)
        return "0";
      else
        return `${Math.abs(currentDay - dayOfBirth)} d`;
    return `${Math.abs(currentMonth - monthOfBirth)} m`;  
  }
  
  return currentMonth < monthOfBirth || currentMonth === monthOfBirth && currentDay < dayOfBirth ?
         `${(currentYear - yearOfBirth) - 1}`:`${currentYear - yearOfBirth}`;
}