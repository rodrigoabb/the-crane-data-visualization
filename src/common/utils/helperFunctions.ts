export const sortArrayByKey = (array: Array<any>, key: string, order: string = 'asc') => {
  const arrayCopy = [ ...array ];
  return arrayCopy.sort((a: any, b: any) => {
    if (order.toLowerCase() === 'asc') {
      if (a[key] < b[key]){
        return -1;
      }
      if (a[key] > b[key]){
        return 1;
      } else {
        return 0;
      }
    } else {
      if (a[key] > b[key]){
        return -1;
      }
      if (a[key] < b[key]){
        return 1;
      } else {
        return 0;
      }
    }
  });
};

export const capitalizeFirstLeter = (str: string) => {
  const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
  return capitalized;
}

export const splitArrayByCondition = (array: Array<any>, isValid: (elem: any) => boolean ) => {
  return array.reduce(([pass, fail], elem) => {
    return isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
  }, [[], []]);
}

export const generateRandomHexColours = (number: number) => {
  const randomColours: string[] = [];
  while (randomColours.length < number) {
    const decValue = Math.floor(Math.random()*16777215);
    const hexaValue = decValue.toString(16).padStart(6, '0');

    // Avoid black-ish colours
    if (decValue < 1000000) {
      continue;
    }

    let isSimilar = false;
    if (randomColours.length > 0) {

      // Check if it's not a similar colour
      for (let j = 0; j < randomColours.length; j += 1) {
        const colour = randomColours[j];
        const hexaColour = colour.slice(1, colour.length);
        const decColour = parseInt(hexaColour, 16);
        if (Math.abs(decValue - decColour) < 600000) {
          isSimilar = true;
          break;
        }
      }
      if (!isSimilar) {
        const color = `#${hexaValue}`;
        randomColours.push(color);
      }
    } else {
      const color = `#${hexaValue}`;
      randomColours.push(color);
    }


  }
  return randomColours;
}
