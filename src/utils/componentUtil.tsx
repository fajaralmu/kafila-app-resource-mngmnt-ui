import { randomString } from "./stringUtil";
import React from 'react'

export const readFileContentUtf8 = (file:File): Promise<string> => {

    return new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = (evt) => {
            let el = evt.target;
            if (!el)
            {
                reject(new Error("Invalid element"));
                return;
            }
            if (typeof el.result == "string")
            {
                resolve(el.result);
            }
            else
            {
                reject(new Error("Invalid result type"));
            }
        }
        reader.onerror = reject;
    })
}

export const downloadFile = (data:any, filename:string, type:"text/plain" | "application/json") : void => {
    var file = new Blob([data], {type: type});
    if ((window.navigator as any).msSaveOrOpenBlob) // IE10+
        (window.navigator as any).msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

export const CommonTable = (props:{className:string, content:any[][]}) => {
    return (
        <table className={props.className}>
            <tbody>
                {props.content.map(row=>{
                    const rowKey = "row-"+randomString(5);
                    return <tr key={rowKey}>
                        {row.map((col, i)=>{
                            return <td key={rowKey+ "-" + i}>{col}</td>
                        })}
                    </tr>
                })}
            </tbody>
        </table>
    )
}