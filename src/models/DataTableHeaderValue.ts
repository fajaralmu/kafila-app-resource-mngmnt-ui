
export default class DataTableHeaderValue {
    label:string | null | undefined;
    constructor(public name:string | null, label?:string | null , public orderable = true, public filterable = true){
        this.label = label ?? name;
        this.filterable = this.orderable ? filterable : false;
        this.adjustLabel();
    }

    adjustLabel = () => {
        if (!this.label) return;

        if (this.label.includes(".")) {
            const splitByDot = this.label.split(".");
            this.label = splitByDot[splitByDot.length-1];
        }

        this.label = capitalize(this.label);
    }
}

const capitalize = (val:string) => {
    return val[0].toUpperCase() + val.substring(1, val.length);
}