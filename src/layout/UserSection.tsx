import { Component, ReactNode } from "react";
import { commonWrapper } from './../utils/commonWrapper';
import User from './../models/User';
import { resolve } from "inversify-react";
import AuthService from './../services/AuthService';
import DialogService from './../services/DialogService';
import BaseProps from './../models/BaseProps';
import { Link } from "react-router-dom";

interface Props  extends BaseProps
{
    user:User
}
class State 
{
    showDropdown: boolean = false;
}
class UserSection extends Component<Props, State>
{
    state: Readonly<State> = new State();

    @resolve(AuthService)
    private authService:AuthService;
    @resolve(DialogService)
    private dialog:DialogService;

    logout = () => {
        this.dialog.showConfirmDanger("Logout", "Do you want to logout?")
            .then(ok => {
                if (ok) {
                    this.authService.logout();
                }
            })
    }
    
    toggleDropdown = () => {
        this.setState({ showDropdown: !this.state.showDropdown });
    }
    render(): ReactNode {

        return (
            <div >
                <a className="btn btn-light" onClick={this.toggleDropdown}>
                    <i className="fas fa-user mr-3" /> {this.props.user.displayName}
                </a>
                <div style={{position: 'absolute'}}>
                    { this.state.showDropdown? 
                    <div
                        style={{width: '200px', zIndex: 1, position: 'relative'}}
                        className="bg-light border border-gray rounded text-left pt-3 pb-3" >
                        { this.authService.isAdmin ?
                        <Link className="btn btn-text text-success" to="/admin">
                            <i className="fas fa-tachometer-alt mr-3"/>Admin Area
                        </Link> : null }
                        <Link className="btn btn-text text-info" to="/myorder">
                            <i className="fas fa-shopping-cart mr-3"/>My Orders
                        </Link>
                        <a className="btn btn-text text-danger" onClick={this.logout}>
                            <i className="fas fa-sign-out-alt mr-3"/>Logout
                        </a>
                    </div> : null }
                </div>
            </div>
        )
    }
}

export default commonWrapper(UserSection);