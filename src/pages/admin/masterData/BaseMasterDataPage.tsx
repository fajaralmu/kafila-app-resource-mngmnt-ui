import { resolve } from "inversify-react";
import BaseModel from "../../../models/BaseModel";
import { BasePage } from "../../BasePage";
import BaseProps from '../../../models/BaseProps';
import MasterDataService from '../../../services/MasterDataService';
import BaseMasterDataState from '../../../models/BaseMasterDataState';
import { FormEvent, Fragment } from "react";
import AnchorButton from "../../../components/buttons/AnchorButton";
import PaginationButtons from "../../../components/buttons/PaginationButtons";
import ActionButton from "../../../components/buttons/ActionButton";
import { randomString } from "../../../utils/stringUtil";
import ModelNames from "../../../constants/ModelNames";
import './MasterDataPage.scss';
import DataTableHeaderValue from "../../../models/DataTableHeaderValue";
import DataTableHeader from "../../../components/dataTableHeader/DataTableHeader";


abstract class BaseMasterDataPage<M extends BaseModel, P extends BaseProps, S extends BaseMasterDataState<M>> extends BasePage<P, S> {
    @resolve(MasterDataService)
    protected service: MasterDataService;

    constructor(props: P, private name: ModelNames, title: string) {
        super(props, true, title);
    }
    abstract get defaultItem(): M;

    get item(): M | undefined { return this.state.item as M | undefined }
    get activeOrder() { return this.state.result.order ?? "id" }
    get isOrderDesc() { return this.state.result.orderDesc === true }
    get startingNumber() { return 1 + (this.state.result.page * this.state.result.limit); }
    get filterParams() {
        const { filter } = this.state;
        const array = [];
        for (const key in filter) {
            array.push(`${key}:${filter[key]}`);
        }
        return array.join(";");
    }

    abstract getDataTableHeaderVals(): DataTableHeaderValue[];

    load = (page: number = 0, perPage: number = 10, order?: string, orderDesc?: boolean) => {
        this.service.list<M>(this.name, page, perPage, order, orderDesc, this.filterParams)
            .then(response => {
                const assignedItems: M[] = [];
                response.items.forEach(item => {
                    assignedItems.push(Object.assign(this.defaultItem, item));
                })
                response.items = assignedItems;
                this.setState({ result: response })
            })
            .catch(console.error);
    }
    componentDidMount(): void {
        this.load();
    }
    onFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        const item = this.state.item as M | undefined;
        if (!item) {
            this.dialog.showError("Submission Error", "Undefined payload");
            return;
        }
        if (item.id === undefined || item.id <= 0) {
            this.insert(item);
        } else {
            this.update(item);
        }
    }
    
    showForm = () => this.setState({ showForm: true });
    hideForm = () => this.setState({ item: this.defaultItem, showForm: false });
    edit = (model: M) => this.setState({ item: model }, this.showForm);

    delete = (model: M) => {
        this.dialog.showConfirmDanger("Delete Item", "Are you sure to delete this item?")
            .then(ok => {
                if (ok) {
                    this.service.delete(this.name, model.id)
                        .then(resp => {
                            this.dialog.showInfo("Delete Success", "Item has been deleted");
                            this.loadCurrentPage();
                        })
                        .catch(err => {
                            this.dialog.showError("Delete Failed", err);
                        })

                }
            })
    }
    insert = (model: M) => {
        this.dialog.showConfirm("Insert Item", "Are you sure to add this item? ")
            .then(ok => {
                if (ok) {
                    this.service.post(this.name, model)
                        .then(resp => {
                            this.dialog.showInfo("Insert Success", "New item has been inserted");
                            this.loadCurrentPage();
                            this.hideForm();
                        })
                        .catch(err => {
                            this.dialog.showError("Insert Failed", err);
                        })

                }
            })
    }
    showInsertForm = () => this.setState({ showForm: true, item: this.defaultItem });
    resetFilter = () => this.setState({ filter: {} }, this.load);
    resetFormAndClose = () => this.setState({ showForm: false, item: this.defaultItem });

    formEditSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (this.state.item && this.state.item.id > 0) {
            this.update(this.state.item as M);
        } else if (this.state.item && (!this.state.item.id || this.state.item.id <= 0)) {
            this.insert(this.state.item as M);
        }
    }
    update = (model: M) => {
        this.dialog.showConfirm("Update Item", "Are you sure to update this item? ")
            .then(ok => {
                if (ok) {
                    this.service.put(this.name, model.id, model)
                        .then(resp => {
                            this.dialog.showInfo("Update Success", "Item has been updated");
                            this.loadCurrentPage();
                            this.hideForm();
                        })
                        .catch(err => {
                            this.dialog.showError("Update Failed", err);
                        })

                }
            })
    }
    patchAction = (model: M, action: string) => {
        this.dialog.showConfirmWarning("Execute Action", "Are you sure to execute action: " + action + "? ")
            .then(ok => {
                if (ok) {
                    this.service.patchAction(this.name, model.id, action)
                        .then(resp => {
                            this.dialog.showInfo("Action Completed", "Action: " + action + " has been executed");
                            this.loadCurrentPage();
                            this.hideForm();
                        })
                        .catch(err => {
                            this.dialog.showError("Update Failed", err);
                        })

                }
            })
    }
    loadCurrentPage = () => {
        this.load(this.state.result.page, this.state.result.limit);
    }
    loadFromForm = (e: FormEvent) => {
        e.preventDefault();
        this.load(0, this.state.result.limit, "id", false);
    }
    setItemsOrder = (name: string, desc: boolean) => {
        this.load(this.state.result.page, this.state.result.limit, name, desc);
    }

    protected getDataTableHeaderComponent = () => {
        return DataTableHeader(
            this.getDataTableHeaderVals(),
            this.activeOrder,
            this.isOrderDesc,
            this.setItemsOrder,
            this.state.filter,
            this.onFilterChange,
        );
    }

    protected onFilterChange = (name: string, value: string) => {
        const { filter } = this.state;
        const valueIsBlank = !value || value.trim() === "";
        if (valueIsBlank && filter[name]) {
            delete filter[name];
        } else {
            filter[name] = value;
        }
        this.setState({ filter: filter }, () => {
            const input = document.getElementById(`input-filter-${name}`);
            input?.focus();
        });
    }

    protected get paginationButton() {
        return (
        <PaginationButtons
            limit={this.state.result.limit}
            totalData={this.state.result.totalData}
            activePage={this.state.result.page}
            onClick={this.load} />
        );
    }

    protected actionButton = (item: M, showDelete: boolean = true) => {
        return (
            <div className="row">
                <div className="col-md-6 px-1">
                    <AnchorButton
                        onClick={() => this.edit(item)}
                        iconClass="fas fa-edit"
                        className="btn btn-text clickable" />
                </div>
                {showDelete ?
                    <div className="col-md-6 px-1">
                        <AnchorButton
                            onClick={() => this.delete(item)}
                            className="btn btn-text text-danger"
                            iconClass="fas fa-times" />
                    </div> : null}
            </div>
        )
    }

    protected listToggler = <T extends BaseModel>(
        items: T[],
        model: M,
        label: (item: T) => string,
        add: (model: M) => any,
        remove: (model: M, id: number) => any) => {
        return (
            <>
                {items.map((item: T) => {
                    return (
                        <div className="listTogglerItem" key={`list-toggler-item-${randomString(5)}`}>
                            <ActionButton
                                onClick={(e) => remove(model, item.id)}
                                className="btn btn-text btn-sm text-danger me-2"
                                iconClass="fas fa-minus-circle" />
                            <span className="no-wrap">{label(item)}</span>
                        </div>
                    );
                })}
                <ActionButton
                    onClick={(e) => add(model)}
                    className="btn btn-sm btn-text"
                    iconClass="fas fa-plus-circle text-success" />
            </>
        );
    }

    protected get closeFormButton() {
        return (
            <ActionButton onClick={this.resetFormAndClose} iconClass="fas fa-times" className="btn btn-secondary btn-sm mx-2">
                Close form
            </ActionButton>
        )
    }
    protected get showFormButton() {
        return (
            <ActionButton onClick={this.showInsertForm} iconClass="fas fa-plus" className="btn btn-primary btn-sm mx-2">
                Insert new data
            </ActionButton>
        )
    }

    protected get tableFooter() {
        return (
            <tfoot>
                <tr>
                    <td colSpan={4}>
                        <ActionButton type="submit" iconClass="fas fa-redo" className="btn btn-secondary btn-sm me-2">
                            Reload
                        </ActionButton>
                        <ActionButton type="button" onClick={this.resetFilter} className="btn btn-warning btn-sm">
                            Reset Filter
                        </ActionButton>
                    </td>
                </tr>
            </tfoot>
        )
    }
}

export default BaseMasterDataPage;