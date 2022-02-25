export const randomString = (length:number)=> {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() *  charactersLength));
   }
   return result;
}

export const getInputReadableDate = (date:Date) :string => {
   const year = date.getFullYear();

   const arr = [year, twoDigits(date.getMonth()+1), twoDigits(date.getDate())];
   return arr.join("-");
}
export const twoDigits = (value:number) :string => {
   if (value >= 10) {
       return   value.toString();
   }
   return "0"+value;
}
