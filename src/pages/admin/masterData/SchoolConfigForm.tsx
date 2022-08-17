import { resolve } from "inversify-react";
import { Component, FormEvent } from "react";
import ActionButton from "../../../components/buttons/ActionButton";
import School from '../../../models/School';
import SchoolConfig from '../../../models/SchoolConfig';
import { commonWrapper } from "../../../utils/commonWrapper";
import Employee from '../../../models/Employee';
import DialogService from '../../../services/DialogService';
import SchoolConfigService from '../../../services/SchoolConfigService';
import SelectEmployeeForm from "./SelectEmployeeForm";

interface Props {
  school: School;
  config: SchoolConfig;
}

interface State {
  config: SchoolConfig;
}

class SchoolConfigForm extends Component<Props, State> {
  @resolve(DialogService)
  private dialog: DialogService;
  @resolve(SchoolConfigService)
  private service: SchoolConfigService;

  constructor(props: Props) {
    super(props);
    this.state = {
      config: props.config,
    };
  }
  onSubmit = (e: FormEvent) => {
    e.preventDefault();
    this.saveConfig();
  }
  saveConfig = () => {
    const { config } = this.state;
    this.dialog.showConfirm('Save School Config', 'Do you want to save config?')
      .then((ok) => {
        if (ok) {
          this.service.update(config)
            .then(() => {
              this.dialog.showInfo('School Config Update', 'Config has been updated');
            })
            .catch((err) => this.dialog.showError('School Config Update', err));
        }
      });
  }

  selectHeadMaster = () => {
    this.showSelectEmployeeForm('Select School Head Master', 'headMaster');
  }
  selectAdmin = () => {
    this.showSelectEmployeeForm('Select School Admin', 'admin');
  }

  showSelectEmployeeForm = (title: string, field: keyof SchoolConfig) => {
    const { config } = this.state;
    const onSelect = (e: Employee) => {
      (config as any)[field] = e;
      this.setState({ config });
    }

    this.dialog.showContent(title, <SelectEmployeeForm onSelect={onSelect} />);
  }

  render() {
    const { school } = this.props;
    const { config } = this.state;
    return (
      <form className="container-fluid" onSubmit={this.onSubmit}>
        <h4 className="text-center">School Config {school.name}</h4>
        <table>
          <tbody>
            <tr>
              <td>
                <div>
                  <ActionButton iconClass="fas fa-edit" className="btn btn-text btn-sm me-1" onClick={this.selectHeadMaster} />
                  Head Master
                </div>
              </td>
              <td><span className="px-3">{config.headMaster?.user?.fullName ?? '-'}</span></td>
            </tr>
            <tr>
              <td>
                <div>
                  <ActionButton iconClass="fas fa-edit" className="btn btn-text btn-sm me-1" onClick={this.selectAdmin} />
                  Admin
                </div>
              </td>
              <td><span className="px-3">{config.admin?.user?.fullName ?? '-'}</span></td>
            </tr>
            <tr>
              <td colSpan={2}>
                <button type="submit" className="btn btn-primary">Save</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    )
  }
}

export default commonWrapper(SchoolConfigForm);
