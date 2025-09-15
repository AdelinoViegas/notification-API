export function calculateAge(birthDate: string | Date){
  const yearOfBirth = new Date(birthDate).getFullYear();
  const currentYear = new Date().getFullYear();
  return isNaN(yearOfBirth)?0:(currentYear - yearOfBirth);
}