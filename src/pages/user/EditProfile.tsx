import { FormEvent, ReactNode } from "react";
import { ViewTemplate } from "../../layout/ViewTemplate";
import BaseProps from "../../models/BaseProps";
import BaseState from "../../models/BaseState";
import User from "../../models/User";
import { commonWrapper } from "../../utils/commonWrapper";
import { BasePage } from "../BasePage";

class State extends BaseState {
    user :User = new User()
}
class EditProfile extends BasePage<BaseProps, State>
{
    state = new State();
    constructor(props:BaseProps)
    {
        super(props, false, "Edit Profile"); 
    }

    componentDidMount(): void {
        if (this.authService.loggedUser)
            this.setState({user: this.authService.loggedUser})
    }

    onSubmit = (e:FormEvent) => {
        e.preventDefault();
        this.dialog.showConfirm("Update Profile", "Save user data?")
            .then(ok => {
                this.authService.updateProfile(this.state.user)
                    .then(response=>{
                        this.dialog.showInfo("Update Success", "Profile has been updated");
                    })
                    .catch(console.error)
            })
            .catch(console.error)
    }

    render(): ReactNode {
        const user = this.state.user;
        return (
            <ViewTemplate title="Edit Profile" back="/dashboard">
                <form onSubmit={this.onSubmit}>
                    <p>Email</p>
                    <input className="form-control" name="user.email" value={user.email} onChange={this.handleInputChange} />
                    <p>Username</p>
                    <input className="form-control" name="user.username" value={user.username} onChange={this.handleInputChange}/>
                    <p>Display Name</p>
                    <input className="form-control" name="user.displayName" value={user.displayName} onChange={this.handleInputChange}/>
                    <p>Password <i>Leave it empty if you don't want to change it</i></p>
                    <input autoComplete="off" className="form-control" type="password" name="user.editPassword" value={user.editPassword} onChange={this.handleInputChange} />
                    <p/>
                    <input className="btn btn-success" type="submit" value="Save" />
                </form>
            </ViewTemplate>
        )
    }
}

export default commonWrapper(EditProfile);