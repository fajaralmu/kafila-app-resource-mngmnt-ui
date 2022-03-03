import { BasePage } from "../BasePage";
import BaseProps from '../../models/BaseProps';
import { FormEvent, ReactNode } from "react";
import { ViewTemplate } from "../../layout/ViewTemplate";
import { commonWrapper } from './../../utils/commonWrapper';
import BaseState from './../../models/BaseState';
import { Link } from "react-router-dom";
import ErrorMessage from './../../components/messages/ErrorMessage';
import InfoMessage from './../../components/messages/InfoMessage';
import { invokeLater } from './../../utils/eventUtil';
import ActionButton from './../../components/buttons/ActionButton';
import { CommonTable } from "../../utils/componentUtil";

class State  extends BaseState
{
    username:string            = "";
    password:string         = "";
    loading:boolean         = false;
    loginSuccess:boolean    = false;
}
class LoginPage extends BasePage<BaseProps, State>
{
    state: Readonly<State> = new State();
   
    constructor(props:BaseProps)
    {
        super(props, false, "Login");
    }
    onSubmit = (e:FormEvent) => {
        console.log("ON submit login");
        e.preventDefault();
        this.setState({ loading: true });

        this.authService.login(this.state.username, this.state.password)
            .then((user) => {
                this.setState({ error: undefined, loginSuccess: true }, 
                    () => invokeLater(this.handleSuccessLogin, 500) );
            })
            .catch((err) => {
                this.setState({ error: new Error(err?.message) });
            })
            .finally(() => {
                this.setState({ loading: false });
            })
    }

    handleSuccessLogin = () => {
        if (this.authService.isAdmin) {
            this.navigate("/admin");
            return;
        }
        this.gotoHomePage();
    }

    componentDidMount(): void {
        if (this.authService.loggedIn)
        {
            this.navigate("/");
        }
        
    }

    render(): ReactNode {
        
        if (this.state.loginSuccess)
        {
            return (
                <ViewTemplate>
                    <div className="pt-5 pb-5 pl-5 pr-5 text-center">
                        <InfoMessage >
                            Login Succes
                        </InfoMessage> 
                    </div>
                </ViewTemplate>
            )
        }
        return (
            <ViewTemplate >
                <form onSubmit={this.onSubmit} className="row mt-3 ">
                    <div className="col-md-4"/>
                    <div className="col-md-4 bg-light" style={{padding: 20}}>
                        
                        <ErrorMessage show={this.state.error != undefined}>
                            {this.state.error?.message}
                        </ErrorMessage> 
                        <CommonTable
                            className="table table-borderless"
                            content={[
                                [
                                    "Username",
                                    <input 
                                        id="username"
                                        name="username"
                                        value={this.state.username}
                                        onChange={this.handleInputChange}
                                        className="form-control" 
                                        required/>            
                                ],
                                [
                                    "Password",
                                    <input 
                                        type="password"
                                        name="password"
                                        id="password"
                                        value={this.state.password}
                                        onChange={this.handleInputChange}
                                        className="form-control"
                                        required/>
                                ]
                            ]} />
                        { this.state.loading? 
                        <i>Please wait...</i> : 
                        <ActionButton className="btn btn-success mt-3">
                            Login
                        </ActionButton> }
                        <p className="mt-3">
                            Don't have account? Contact admin
                        </p>
                    </div>
                </form>
            </ViewTemplate>
        )
    }
}

export default commonWrapper(LoginPage)