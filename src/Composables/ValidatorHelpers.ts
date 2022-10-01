/* This function checks if the current value has at least one character regardless of the type of the input value 
   So, the most importatnt features of this function are:
       - If the input value is null or undefined, it will return false
       - If the input value in not null or undefined it will be trimmed and if the length of the resultant output is less than one, it will return false
*/
export const required = (value: any) => {
  if (value === undefined || value === null) return false;

  return `${value}`.trim().length > 0;
};
