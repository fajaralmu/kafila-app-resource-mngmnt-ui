import { resolve } from "inversify-react";
import { FormEvent } from "react";
import ActionButton from "../../../components/buttons/ActionButton";
import MasterDataService from "../../../services/MasterDataService";
import ToastService from "../../../services/ToastService";
import ControlledComponent from "../../ControlledComponent";
import Employee from './../../../models/Employee';

type SetEmployeeFormProps = { onSelect(employee: Employee): any, };
type SetEmployeeFormState = { searchEmployee: string, employees: Employee[], selectedEmployee: Employee | undefined };

export default class SelectEmployeeForm extends ControlledComponent<SetEmployeeFormProps, SetEmployeeFormState> {

  @resolve(MasterDataService)
  private service: MasterDataService;
  @resolve(ToastService)
  private toast: ToastService;

  constructor(props: SetEmployeeFormProps) {
    super(props);
    this.state = {
      searchEmployee: '',
      employees: [],
      selectedEmployee: undefined,
    }
  }

  search = (e: FormEvent) => {
    e.preventDefault();
    this.service.list<Employee>('employees', 0, 10, 'user.fullName', false, 'user.fullName:' + this.state.searchEmployee)
      .then((result) => {
        this.handleSearchEmployee(result.items);
      })
      .catch(console.error);
  }
  handleSearchEmployee = (items: Employee[]) => {
    if (!items || items.length === 0) {
      this.toast.showDanger("No employee contains name \"" + this.state.searchEmployee + "\" was found");
      return;
    }
    this.setState({ employees: items });
  }
  closeDropdown = () => {
    this.setState({ employees: [] });
  }
  setSelectedEmployee = (e: Employee) => {
    this.setState({ selectedEmployee: e, searchEmployee: e.user.fullName }, this.closeDropdown);
  }
  submit = () => {
    const { selectedEmployee } = this.state;
    if (!selectedEmployee) {
      this.toast.showDanger("Invalid employee");
      return;
    }
    this.props.onSelect(selectedEmployee);
    (this.props as any).dialogObserver?.close();
  }

  render() {
    const { employees } = this.state;
    return (
      <div>
        <p>Select Employee</p>
        <form onSubmit={this.search} className="my-5 mx-5 pb-5">
          <div className="input-group">
            <input
              type="search"
              className="form-control"
              name="searchEmployee"
              value={this.state.searchEmployee}
              placeholder="Full Name"
              onChange={this.handleInputChange}
              required />
            <div className="input-group-append">
              <input type="submit" className="btn btn-primary" value={"Search"} />
            </div>
          </div>

          <div style={{ position: 'absolute', width: '75%' }}>
            {employees.length > 0 ?

              <div className="bg-light border border-dark px-2 py-1 w-100" style={{ position: 'relative' }}>
                <ActionButton className="btn btn-text btn-sm" iconClass="fas fa-times" onClick={this.closeDropdown}>close</ActionButton>
                <div style={{ overflowY: 'auto', height: '100px' }}>
                  <div className="no-wrap" style={{ width: 'max-content' }}>
                    {employees.map(e => {
                      return (
                        <div key={"set-emp-" + e.id}>
                          <a className="btn btn-text clickable" onClick={() => this.setSelectedEmployee(e)}>
                            {e.user.fullName.trim()}, nisdm: {e.nisdm}
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div> : null}
          </div>
          <button type="button" className="btn btn-success mt-3" onClick={this.submit}>
            Ok
          </button>
        </form>
      </div>
    )
  }
}