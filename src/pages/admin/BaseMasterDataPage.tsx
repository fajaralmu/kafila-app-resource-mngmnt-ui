import { resolve } from "inversify-react";
import BaseModel from "../../models/BaseModel";
import { BasePage } from "../BasePage";
import BaseProps from './../../models/BaseProps';
import MasterDataService from './../../services/MasterDataService';
import BaseMasterDataState from './../../models/BaseMasterDataState';
import { FormEvent, Fragment } from "react";
import AnchorButton from "../../components/buttons/AnchorButton";

let models : "employees" | "users" | "students" | "schools" ;

abstract class BaseMasterDataPage<M extends BaseModel, P extends BaseProps, S extends BaseMasterDataState<M>> extends BasePage<P, S>
{
    @resolve(MasterDataService)
    private service:MasterDataService;

    constructor(props:P, private  name:typeof models, title:string)
    {
        super(props, true, title);
    }
    abstract get defaultItem() : M;
    get item():M | undefined { return this.state.item as M | undefined  }
    load = (page:number = 0, perPage:number = 10) => {
        this.service.list<M>(this.name, page, perPage)
            .then(response=>{
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
    formEditSubmit = (e:FormEvent) => {
        e.preventDefault();
        if (this.state.item)
        {
            this.update(this.state.item as M);
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
    loadCurrentPage = () => {
        this.load(this.state.result.page, this.state.result.limit);
    }
    
    get startingNumber()
    {
        return 1 +(this.state.result.page * this.state.result.limit);
    }
    protected actionButton = (item:M, showDelete:boolean = true) => {
        return (
            <Fragment>
                <AnchorButton 
                    onClick={()=>this.edit(item)}
                    iconClass="fas fa-edit"
                    className="btn btn-text clickable"/>
                {showDelete?<AnchorButton 
                    onClick={()=>this.delete(item)}
                    className="btn btn-text text-danger"
                    iconClass="fas fa-times"/>:null}
            </Fragment>
        )
    }
}

export default BaseMasterDataPage;