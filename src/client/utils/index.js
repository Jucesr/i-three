export const replaceAll = (target, search, replacement) => {
  return target.replace(new RegExp(search, "g"), replacement)
}
export const replaceNullWithBlank = (target) => {
  return JSON.parse(JSON.stringify(target, (key, value) => {
      // Filtering out properties
      if (value === null || value === undefined) {
        return '';
      }
      return value;
    }))
}

export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export const formatReference = (reference_number) => {
  	let aux = reference_number.toString()
    aux = aux.padStart(aux.length % 2 == 0 ? aux.length : aux.length + 1,'0')
    return aux.replace(/\B(?=(\d{2})+(?!\d))/g, ".");
}
