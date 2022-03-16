import { ChangeEvent } from "react";
import DataTableHeaderValue from "../../models/DataTableHeaderValue";
import { randomString } from "../../utils/stringUtil";
import './DataTableHeader.scss';

const DataTableHeader = (
    items:DataTableHeaderValue[], 
    activeOrder:string, 
    orderDesc:boolean, 
    onClick:(name:string, desc:boolean)=>any,
    filter: any,
    onChange: (name:string, value:string)=>any,
) => {

    return items.map(item => {
        let className = activeOrder === item.name ? "text-center bg-light" : "text-center";
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
                {item.orderable ?
                <button type="button" className={`sortButton mb-1 btn btn-text w-100 ${textColor}`} onClick={tdOnClick} >
                    <b className="text-start w-100">{item.label}</b>
                    {isActive ?
                    <i className={`fas ${orderDesc ? 'fa-long-arrow-alt-down' : 'fa-long-arrow-alt-up'} ms-2`} /> :
                    <i className="fas fa-sort ms-2" />}
                </button> : <span className="text-secondary">{item.label}</span>}
                {item.filterable && item.name?
                <input id={`input-filter-${item.name}`} className="form-control form-control-sm" value={filter[item.name] ?? ""} onChange={_onChange} /> : 
                null}
            </th>
        )
    })
}

export default DataTableHeader;

