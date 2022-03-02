import { resolve } from "inversify-react";
import BaseModel from "../../models/BaseModel";
import { BasePage } from "../BasePage";
import BaseProps from './../../models/BaseProps';
import MasterDataService from './../../services/MasterDataService';
import BaseMasterDataState from './../../models/BaseMasterDataState';
import { FormEvent, Fragment } from "react";
import AnchorButton from "../../components/buttons/AnchorButton";
import { DataTableHeaders, DataTableHeaderValue } from "../../utils/componentUtil";
import PaginationButtons from "../../components/buttons/PaginationButtons";
import ActionButton from "../../components/buttons/ActionButton";
import { randomString } from "../../utils/stringUtil";
import { randomUUID } from "crypto";
import ModelNames from "../../constants/ModelNames";


abstract class BaseMasterDataPage<M extends BaseModel, P extends BaseProps, S extends BaseMasterDataState<M>> extends BasePage<P, S>
{
    @resolve(MasterDataService)
    protected service:MasterDataService;

    constructor(props:P, private  name: ModelNames, title:string)
    {
        super(props, true, title);
    }
    abstract get defaultItem() : M;

    get item():M | undefined { return this.state.item as M | undefined  }
    get activeOrder() { return this.state.result.order ?? "id" }
    get isOrderDesc() { return this.state.result.orderDesc == true }
    get startingNumber() { return 1 +(this.state.result.page * this.state.result.limit); }

    abstract getDataTableHeaderVals() : DataTableHeaderValue[];

    load = (page:number = 0, perPage:number = 10, order?:string, orderDesc?:boolean) => {
        this.service.list<M>(this.name, page, perPage, order, orderDesc)
            .then(response=>{
                const assignedItems:M[] = [];
                response.items.forEach(item => {
                    assignedItems.push(Object.assign(this.defaultItem, item));
                })
                response.items = assignedItems;
                this.setState({result: response})
            })
            .catch(console.error);
    }
    componentDidMount(): void {
        this.load();
    }
    onFormSubmit = (e:FormEvent) => {
        e.preventDefault();
        const item = this.state.item as M | undefined;
        if (!item)
        {
            this.dialog.showError("Submission Error", "Undefined payload");
            return;
        }
        if (item.id ==undefined || item.id <= 0)
        {
            this.insert(item);
        }
        else
        {
            this.update(item);
        }
    }
    showForm = () => this.setState({ showForm: true });
    hideForm = () => this.setState({ item: this.defaultItem, showForm: false });
    edit = (model:M) => {
        this.setState({item: model}, this.showForm);
    }
    delete = (model:M) => {
        this.dialog.showConfirmDanger("Delete Item", "Are you sure to delete this item? ")
            .then(ok=>{
                if (ok) {
                    this.service.delete(this.name, model.id)
                        .then(resp => {
                            this.dialog.showInfo("Delete Success", "Item has been deleted");
                            this.loadCurrentPage();
                        })
                        .catch(err=>{
                            this.dialog.showError("Delete Failed", err);
                        })

                }
            })
    }
    insert = (model:M) => {
        this.dialog.showConfirm("Insert Item", "Are you sure to add this item? ")
            .then(ok=>{
                if (ok) {
                    this.service.post(this.name, model)
                        .then(resp => {
                            this.dialog.showInfo("Insert Success", "New item has been inserted");
                            this.loadCurrentPage();
                            this.hideForm();
                        })
                        .catch(err=>{
                            this.dialog.showError("Insert Failed", err);
                        })

                }
            })
    }
    showInsertForm = () => {
        this.setState({ showForm: true, item: this.defaultItem });
    }
    resetFormAndClose = () => {
        this.setState({ showForm: false, item: this.defaultItem });
    }
    formEditSubmit = (e:FormEvent) => {
        e.preventDefault();
        if (this.state.item && this.state.item.id > 0)
        {
            this.update(this.state.item as M);
        } else if (this.state.item && (!this.state.item.id || this.state.item.id <= 0))
        {
            this.insert(this.state.item as M);
        }
    }
    update = (model:M) => {
        this.dialog.showConfirm("Update Item", "Are you sure to update this item? ")
            .then(ok=>{
                if (ok) {
                    this.service.put(this.name, model.id, model)
                        .then(resp => {
                            this.dialog.showInfo("Update Success", "Item has been updated");
                            this.loadCurrentPage();
                            this.hideForm();
                        })
                        .catch(err=>{
                            this.dialog.showError("Update Failed", err);
                        })

                }
            })
    }
    patchAction = (model:M, action:string) => {
        this.dialog.showConfirmWarning("Execute Action", "Are you sure to execute action: "+action+"? ")
            .then(ok=>{
                if (ok) {
                    this.service.patchAction(this.name, model.id, action)
                        .then(resp => {
                            this.dialog.showInfo("Action Completed", "Action: "+action+" has been executed");
                            this.loadCurrentPage();
                            this.hideForm();
                        })
                        .catch(err=>{
                            this.dialog.showError("Update Failed", err);
                        })

                }
            })
    }
    loadCurrentPage = () => {
        this.load(this.state.result.page, this.state.result.limit);
    }
    setItemsOrder = (name:string, desc:boolean) => {
        this.load(this.state.result.page, this.state.result.limit, name, desc);
    }

    protected getDataTableHeaderComponent = () => {
        return DataTableHeaders(
            this.getDataTableHeaderVals(), 
            this.activeOrder, 
            this.isOrderDesc, 
            this.setItemsOrder
        );
    }
    
    protected get paginationButton() {
        return <PaginationButtons 
                    limit={this.state.result.limit} 
                    totalData={this.state.result.totalData} 
                    activePage={this.state.result.page} 
                    onClick={this.load} />
    }
    
    protected actionButton = (item:M, showDelete:boolean = true) => {
        return (
            <div className="row">
                <div className="col-md-6 px-1">
                    <AnchorButton 
                        onClick={()=>this.edit(item)}
                        iconClass="fas fa-edit"
                        className="btn btn-text clickable"/>
                </div>
                {showDelete?
                <div className="col-md-6 px-1">
                    <AnchorButton 
                        onClick={()=>this.delete(item)}
                        className="btn btn-text text-danger"
                        iconClass="fas fa-times"/>
                </div> : null }
            </div>
        )
    }

    protected listToggler = <T extends BaseModel>(
        items:T[],
        model:M,
        label:(item:T)=>string,
        add:(model:M)=>any, 
        remove:(model:M, id:number)=>any) => {
        return (
            <>
                {items.map((item:T) => {
                    return (
                        <div key={`list-toggler-item-${randomString(5)}`}>
                            <ActionButton 
                                onClick={(e) => remove(model, item.id)} 
                                className="btn btn-text btn-sm text-danger mr-2" 
                                iconClass="fas fa-minus-circle" />
                            {label(item)}
                        </div>
                    );
                })}
                <ActionButton 
                    onClick={(e) => add(model)}
                    className="btn btn-sm btn-text" 
                    iconClass="fas fa-plus-circle text-success"/>
            </>
        );
    }
}

export default BaseMasterDataPage;