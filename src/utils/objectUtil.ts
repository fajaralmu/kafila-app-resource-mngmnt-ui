

export const arrayPadLeft = (array:any[], step:number) => {
    for (let i = 0; i < array.length - step; i++) {
        array[i] = array[i+step];
    }
}

export const camelCaseKey = (o:any) => {
    let newO:any, origKey:string, newKey:string, value:any;
    if (o instanceof Array) {
      return o.map(function(value) {
          if (typeof value === "object") {
            value = camelCaseKey(value)
          }
          return value
      })
    } else {
      newO = {}
      for (origKey in o) {
        if (o.hasOwnProperty(origKey)) {
          newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString()
          value = o[origKey]
          if (value instanceof Array || (value !== null && value.constructor === Object)) {
            value = camelCaseKey(value)
          }
          newO[newKey] = value
        }
      }
    }
    return newO
  }