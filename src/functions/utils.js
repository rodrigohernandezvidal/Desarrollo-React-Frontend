// utils.js
/***********************************************************************************/
// Función para validar y formatear RUT chileno
export const formatAndValidateRUT = (rut) => {
    if (!rut) return { formattedRUT: '', isValid: false };
  
    // Eliminar caracteres no numéricos o 'Kk'
    let cleanedRUT = rut.replace(/[^\dKk]/g, '').toUpperCase();
    
    // Formatear el RUT con puntos y guión
    let formattedRUT = cleanedRUT;
    if (cleanedRUT.length > 1) {
      formattedRUT = cleanedRUT.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + cleanedRUT.charAt(cleanedRUT.length - 1);
    }
  
    // Validar el RUT
    const cuerpo = cleanedRUT.slice(0, -1);
    const dv = cleanedRUT.slice(-1);
    
    if (!/^\d+$/.test(cuerpo) || cuerpo.length < 7) return { formattedRUT, isValid: false };
  
    let suma = 0;
    let factor = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo.charAt(i)) * factor;
      factor = factor === 7 ? 2 : factor + 1;
    }
    
    const resultado = 11 - (suma % 11);
    const dvCalculado = resultado === 11 ? '0' : resultado === 10 ? 'K' : resultado.toString();
  
    const isValid = dv === dvCalculado;
  
    return { formattedRUT, isValid };
  };
  /*********************************************************************************/
  export const dataNow = () =>{
      const today = new Date();
      const day = String(today.getDate()).padStart(2, "0");
      const month = String(today.getMonth() + 1).padStart(2, "0"); // Los meses empiezan desde 0
      const year = today.getFullYear();
      return `${year}-${month}-${day}`;
    };
 /**********************************************************************************/
 export const dataNowAddMonth = () => {
  const today = new Date();
  today.setMonth(today.getMonth() + 1); // Sumar 1 al mes actual

  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth()).padStart(2, "0"); // Los meses comienzan en 0
  const year = today.getFullYear();

  return `${year}-${month}-${day}`;
};
 /*********************************************************************************/
 export const validateNumber = (input) => {
  const rawValue = input?.replace(/[^\d.-]/g, '') || ''; 
  return parseFloat(rawValue) || 0;
 }
 /********************************************************************************/
 export const formatDate = (date) => {
  if (!date) return 'Fecha inválida';

  const newDate = new Date(date);
  if (isNaN(newDate)) return 'Fecha inválida';

  const day = String(newDate.getDate()).padStart(2, '0');
  const month = String(newDate.getMonth() + 1).padStart(2, '0');
  const year = newDate.getFullYear();

  return `${day}/${month}/${year}`;
};
/******************************************************************************/
export const getCurrentTimestamp = () => {
  return new Date().toISOString();
};    
/*****************************************************************************/
// Validador de RUT chileno
export function validateRut(rut) {
  if (!rut || typeof rut !== 'string') return false;
  
  // Limpiar y formatear RUT
  const cleanRut = rut.replace(/[^0-9kK-]/g, '').toUpperCase();
  
  // Validar formato básico
  if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(cleanRut)) return false;
  
  const [numbers, dv] = cleanRut.split('-');
  
  // Validar que el DV sea correcto
  return calculateDv(numbers) === dv;
}

function calculateDv(numbers) {
  let sum = 0;
  let multiplier = 2;
  
  // Calcular suma ponderada
  for (let i = numbers.length - 1; i >= 0; i--) {
    sum += parseInt(numbers.charAt(i)) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  // Calcular dígito verificador
  const dv = 11 - (sum % 11);
  if (dv === 11) return '0';
  if (dv === 10) return 'K';
  return dv.toString();
}