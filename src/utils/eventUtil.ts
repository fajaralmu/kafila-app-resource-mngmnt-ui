export const invokeLater = (callback:()=>any, intervalMs:number) => {
    const timeout = setTimeout(()=>{
        callback();
        clearTimeout(timeout);
      }, intervalMs)
}