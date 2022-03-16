import { ChangeEvent } from "react";
import DataTableHeaderValue from "../models/DataTableHeaderValue";
import { randomString } from "../utils/stringUtil";

const DataTableHeaders = (
    items:DataTableHeaderValue[], 
    activeOrder:string, 
    orderDesc:boolean, 
    onClick:(name:string, desc:boolean)=>any,
    filter: any,
    onChange: (name:string, value:string)=>any,
) => {

    return items.map(item => {
        let className = activeOrder === item.name ? "bg-light" : "";
        let textColor = activeOrder === item.name ? "text-dark":"text-secondary";
        let tdOnClick = (e:any) => {
            if (item.orderable && item.name) {
                onClick(item.name, !orderDesc);
            }
        }
        const _onChange = (e:ChangeEvent) => {
            if (!item.name) {
                return;
            }
            const input = e.target as HTMLInputElement;
            onChange(item.name, input.value);
        }
        const isActive = activeOrder === item.name;
        return (
            <th key={"th-item-"+randomString(3)} className={className}>
                <button type="button" className={`btn btn-text w-100 ${textColor}`} onClick={tdOnClick} >
                    <b>{item.label}</b>
                    {item.orderable ?
                    isActive ?
                    <i className={`fas ${orderDesc ? 'fa-long-arrow-alt-down' : 'fa-long-arrow-alt-up'} ms-2`} /> :
                    <i className="fas fa-sort ms-2" /> : null}
                </button>
                {item.filterable && item.name?
                <input id={`input-filter-${item.name}`} className="form-control form-control-sm" value={filter[item.name] ?? ""} onChange={_onChange} /> : 
                null}
            </th>
        )
    })
}

export default DataTableHeaders;

