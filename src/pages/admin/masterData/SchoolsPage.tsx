import { resolve } from "inversify-react";
import { ChangeEvent, FormEvent, ReactNode } from "react";
import { ViewTemplate } from "../../../layout/ViewTemplate";
import BaseMasterDataState from '../../../models/BaseMasterDataState';
import BaseProps from '../../../models/BaseProps';
import DataTableHeaderValue from "../../../models/DataTableHeaderValue";
import School from "../../../models/School";
import { commonWrapper } from "../../../utils/commonWrapper";
import BaseMasterDataPage from "./BaseMasterDataPage";
import SchoolConfigService from './../../../services/SchoolConfigService';
import ActionButton from "../../../components/buttons/ActionButton";
import SchoolConfig from './../../../models/SchoolConfig';
import SchoolConfigForm from "./SchoolConfigForm";
import Settings from "../../../settings";
import DefaultDialogObserver from "../../../components/dialog/DefaultDialogObserver";
import FileUploadService from "../../../services/FileUploadService";
import UploadFileForm from "./UploadFileForm";

class State extends BaseMasterDataState<School> {
  showConfigForm = false;
  config?: SchoolConfig;
}
class SchoolsPage extends BaseMasterDataPage<School, BaseProps, State> {
  @resolve(SchoolConfigService)
  private configService: SchoolConfigService;
  @resolve(FileUploadService)
  private upload: FileUploadService;

  constructor(props: BaseProps) {
    super(props, "schools", "School Management");
    this.state = new State();
  }
  get defaultItem(): School { return new School() }
  getDataTableHeaderVals(): DataTableHeaderValue[] {
    return [
      new DataTableHeaderValue("nis", "NIS"),
      new DataTableHeaderValue("name", "Name"),
      new DataTableHeaderValue("level", "Level"),
      new DataTableHeaderValue("code", "Code"),
      new DataTableHeaderValue("address", "Address"),
      new DataTableHeaderValue(null, "Stamp", false),
      new DataTableHeaderValue(null, "Config", false),
    ]
  }
  showConfigForm = (item: School) => {
    this.configService.getConfig(item.id)
      .then((config) => {
        this.setState({ config,  item, showConfigForm: true })
      })
      .catch((e) => this.dialog.showError("Load Config Failed", e));
  }
  afterFormCloseCallback = () => {
    this.setState({ showConfigForm: false });
  }
  showStampForm = (item: School) => {
    const dialogObs = DefaultDialogObserver.create();
    const submit = (sch: School, file: File) => {
      this.upload.uploadSchoolStamp(sch, file)
        .then(() => {
          this.toast.showSuccess('Stamp has been uploaded');
          dialogObs.close();
          // Force update to reload all signature image
          this.forceUpdate();
        })
        .catch((e) => {
          this.toast.showDanger('Failed to upload stamp');
          console.error(e);
        });
    }
    this.dialog.showContent(
      'Upload School Stamp',
      <UploadFileForm submit={(file) => submit(item, file)} />,
      dialogObs
    );
  }

  render() {

    const { showForm, config, showConfigForm, item, result } = this.state;
    if (config && showConfigForm && item) {
      return (
        <ViewTemplate title={this.title} back="/admin">
          {this.closeFormButton}
          <SchoolConfigForm school={item} config={config} />
        </ViewTemplate>
      )
    }

    if (showForm && item) {
      return (
        <ViewTemplate title={this.title} back="/admin">
          {this.closeFormButton}
          <FormEdit item={item} handleInputChange={this.handleInputChange} onSubmit={this.formEditSubmit} />
        </ViewTemplate>
      );
    }
    const items = result?.items;
    return (
      <ViewTemplate title={this.title} back="/admin">
        {result === undefined || items === undefined ?
          <i>Loading...</i> :
          <form onSubmit={this.loadFromForm} className="mt-5 pl-3 pr-3" style={{ overflow: 'auto' }}>
            {this.paginationButton}
            <table className="commonDataTable table table-striped">
              <thead>
                <tr>
                  <th>No</th>
                  {this.getDataTableHeaderComponent()}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => {
                  return (
                    <tr key={"School-" + item.id}>
                      <td>{this.startingNumber + i}</td>
                      <td>{item.nis}</td>
                      <td>{item.name}</td>
                      <td>{item.level}</td>
                      <td>{item.code}</td>
                      <td>{item.address}</td>
                      <td>
                        <img
                          width={50}
                          height={50}
                          src={stampPath(item.id)}
                        />
                        <div>
                          <ActionButton
                            iconClass="fas fa-edit"
                            className="btn btn-dark btn-sm"
                            onClick={() => this.showStampForm(item)}
                          />
                        </div>
                      </td>
                      <td>
                        <ActionButton
                          className="btn btn-text btn-sm"
                          iconClass="fas fa-cog"
                          onClick={() => this.showConfigForm(item)}
                        />
                      </td>
                      <td>{this.actionButton(item, false)}</td>
                    </tr>
                  )
                })}
              </tbody>
              {this.tableFooter}
            </table>
          </form>}
      </ViewTemplate>
    )
  }
}

const stampPath = (id: any) => {
  return `${Settings.App.hosts.api}/files/school-stamp/${id}?v=${new Date().getTime()}`;
};

const FormEdit = (props: {
  item: School,
  onSubmit: (e: FormEvent) => any,
  handleInputChange: (e: ChangeEvent) => any
}) => {
  const item = props.item;
  return (
    <div className="formEditContainer">
      <form className="masterDataForm px-3 py-3 border rounded border-gray" onSubmit={props.onSubmit}>
        <p>Nis</p>
        <input className="form-control" name="item.nis" id="item.nis" value={item.nis} onChange={props.handleInputChange} />
        <p>Name</p>
        <input className="form-control" name="item.name" id="item.name" value={item.name} onChange={props.handleInputChange} />
        <p>Code</p>
        <input disabled className="form-control" name="item.code" id="item.code" value={item.code} onChange={props.handleInputChange} />
        <p>Address</p>
        <textarea className="form-control" name="item.code" id="item.address" value={item.address} onChange={props.handleInputChange} />
        <p>Level</p>
        <select className="form-control" name="item.level" id="item.level" value={item.level} onChange={props.handleInputChange}>
          <option>MA</option>
          <option>MTS</option>
        </select>

        <p></p>
        <input className="btn btn-primary" value="Save" type="submit" />
      </form>
    </div>
  );
};

export default commonWrapper(SchoolsPage);
