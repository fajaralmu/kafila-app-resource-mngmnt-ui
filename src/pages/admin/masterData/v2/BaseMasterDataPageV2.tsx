import { resolve } from "inversify-react";
import { ChangeEvent, FormEvent, useState } from "react";
import ActionButton from "../../../../components/buttons/ActionButton";
import AnchorButton from "../../../../components/buttons/AnchorButton";
import PaginationButtons from "../../../../components/buttons/PaginationButtons";
import DataTableHeader from "../../../../components/dataTableHeader/DataTableHeader";
import ModelNames from "../../../../constants/ModelNames";
import BaseDto from "../../../../models/BaseDto";
import BaseMasterDataState from "../../../../models/BaseMasterDataState";
import BaseMasterDataStateV2 from "../../../../models/BaseMasterDataStateV2";
import BaseModel from "../../../../models/BaseModel";
import BaseProps from "../../../../models/BaseProps";
import DataTableHeaderValue from "../../../../models/DataTableHeaderValue";
import MasterDataServiceV2 from "../../../../services/MasterDataServiceV2";
import { randomString } from "../../../../utils/stringUtil";
import { BasePage } from "../../../BasePage";
import '../MasterDataPage.scss';


abstract class BaseMasterDataPageV2<Req extends BaseDto, Res extends BaseDto, P extends BaseProps, S extends BaseMasterDataStateV2<Req, Res>> extends BasePage<P, S> {
  @resolve(MasterDataServiceV2)
  protected service: MasterDataServiceV2;

  constructor(props: P, private name: ModelNames, title: string) {
    super(props, true, title);
  }
  abstract get defaultItem(): Req;

  get item(): Req | undefined { return this.state.item; }
  get activeOrder() { return this.state.result.order ?? 'id' }
  get isOrderDesc() { return this.state.result.orderDesc === true }
  get startingNumber() { return 1 + (this.state.result.page * this.state.result.limit); }
  get filterParams() {
    const { filter } = this.state;
    const array: string[] = [];
    for (const key in filter) {
      array.push(`${key}:${filter[key]}`);
    }
    return array;
  }

  abstract getDataTableHeaderVals(): DataTableHeaderValue[];

  load = (page: number = 0, perPage: number = 10, order?: string, orderDesc?: boolean) => {
    this.service.list<Res>(this.name, page, perPage, order, orderDesc, this.filterParams)
      .then(result => this.setState({ result }))
      .catch(console.error);
  }
  componentDidMount() {
    this.load();
  }
  onFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { item } = this;
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
  edit = (model: Res) => this.setState({ item: this.toReqModel(model) }, this.showForm);

  delete = (id: number) => {
    this.dialog.showConfirmDanger("Delete Item", "Are you sure to delete this item?")
      .then(ok => {
        if (ok) {
          this.service.delete(this.name, id)
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
  insert = (model: Req) => {
    this.dialog.showConfirm("Insert Item", "Are you sure to add this item? ")
      .then(ok => {
        if (ok) {
          this.service.post<Req, Res>(this.name, model)
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
  resetFormAndClose = () => this.setState({ showForm: false, item: this.defaultItem }, this.afterFormCloseCallback);
  afterFormCloseCallback() {
    //
  }
  abstract toReqModel(res: Res): Req;
  formEditSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { item } = this;
    if (item && item.id && item.id > 0) {
      this.update(item);
    } else if (item && (!item.id || item.id <= 0)) {
      this.insert(item);
    }
  }
  update = (model: Req) => {
    const { id } = model;
    if (!id)
      return;

    this.dialog.showConfirm("Update Item", "Are you sure to update this item? ")
      .then(ok => {
        if (ok) {
          this.service.put(this.name, id, model)
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
  // patchAction = (model: M, action: string) => {
  //   this.dialog.showConfirmWarning("Execute Action", "Are you sure to execute action: " + action + "? ")
  //     .then(ok => {
  //       if (ok) {
  //         this.service.patchAction(this.name, model.id, action)
  //           .then(resp => {
  //             this.dialog.showInfo("Action Completed", "Action: " + action + " has been executed");
  //             this.loadCurrentPage();
  //             this.hideForm();
  //           })
  //           .catch(err => {
  //             this.dialog.showError("Update Failed", err);
  //           })

  //       }
  //     })
  // }
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
      filter[name] = encodeURIComponent(value);
    }

    this.setState({ filter }, () => {
      const input = document.getElementById(`input-filter-${name}`);
      input?.focus();
    });
  }

  protected get paginationButton() {
    const { result } = this.state;
    return (
      <div className="row">
        <div className="col-md-8">
          <PaginationButtons
            limit={result.limit}
            totalData={result.totalData}
            activePage={result.page}
            onClick={(page: number) => this.load(page, this.state.result.limit)}
          />
        </div>
        <div className="col-md-4">
          <FormInputLimit defaultLimit={result.limit} onSubmit={(limit) => {
            this.load(0, limit, result.order, result.orderDesc);
          }} />
        </div>
      </div>
    );
  }

  protected actionButton = (item: Res, showDelete: boolean = true) => {
    return (
      <div className="row">
        <div className="col-md-6 px-1">
          <AnchorButton
            onClick={() => this.edit(item)}
            iconClass="fas fa-edit"
            className="btn btn-text clickable" />
        </div>
        {
          showDelete &&
          (
            <div className="col-md-6 px-1">
              <AnchorButton
                onClick={() => item.id ? this.delete(item.id) : {}}
                className="btn btn-text text-danger"
                iconClass="fas fa-times" />
            </div>
          )
        }
      </div>
    )
  }

  protected listToggler = <T extends BaseModel>(
    items: T[],
    model: Res,
    label: (item: T) => string,
    add: (model: Res) => any,
    remove: (model: Res, id: number) => any) => {
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

const FormInputLimit = (props: {
  onSubmit: (limit: number) => any,
  defaultLimit: number,
}) => {
  const [limit, setLimit] = useState(props.defaultLimit);
  const onInputChange = (e: ChangeEvent) => {
    const input = e.target as HTMLInputElement;
    setLimit(parseInt(input.value));
  }
  return (
    <form
      className="input-group"
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit(limit);
      }}
    >
      <input
        type="number"
        value={limit}
        min={1}
        className="form-control form-control-sm"
        onChange={onInputChange}
        required
      />
      <div className="input-group-append">
        <ActionButton
          type="submit"
          className="btn btn-sm btn-info text-white"
          iconClass="fas fa-play"
          children="Apply Page Size"
        />
      </div>
    </form>
  )
}

export default BaseMasterDataPageV2;