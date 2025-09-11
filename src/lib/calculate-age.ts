export function calculateAge(birthDate: string | Date){
  const yearOfBirth = new Date(birthDate).getFullYear();
  const currentYear = new Date().getFullYear();
  return currentYear - yearOfBirth;
}