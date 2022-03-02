import { resolve } from "inversify-react";
import React, { FormEvent  } from "react";  
import { Link } from "react-router-dom";
import BaseProps from "../models/BaseProps";
import { commonWrapper } from "../utils/commonWrapper";
import RoutingService from './../services/RoutingService';
import Settings from './../settings';
import AuthService from './../services/AuthService';
import ControlledComponent from "../pages/ControlledComponent";
import UserSection from "./UserSection";
import User from './../models/User';
import EventService from './../services/EventService';

class State {
    activeMenu:string | undefined;
    title:string        = Settings.App.uiSetting.defaultTitle;
    searchKey:string    = "";
 }
 class Props extends BaseProps {
     currentLocation?:Location;
 }
class HeaderView extends ControlledComponent<Props, State>
{
    @resolve(AuthService)
    private authService:AuthService;
    @resolve(RoutingService)
    private routingService:RoutingService;

    state:State = new State();

    private _user:User | undefined;
    
    componentDidMount() 
    {
        this.routingService.registerCallback("header", console.log);
        this.authService.addOnUserUpdated("header", this.onUserUpdated);
    }
    componentWillUnmount()
    {
        this.authService.removeOnUserUpdated("header");
    }
    gotoLoginPage = () => {
        if (this.props.navigate)
        {
            this.props.navigate("/login");
        }
    }
    onUserUpdated = (user: User | undefined) => {
        if (this._user != undefined && user == undefined)
        {
            this.gotoLoginPage();
        }
        this._user = user;
        this.forceUpdate();
    }

    private navigate = (url:string) => {
        if (this.props.navigate == undefined)
        {
            console.warn("no props: navigate");
            return;
        }
        this.props.navigate(url);
    }

    brandOnClick = () => {
       this.navigate("/");
    }
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <div className="row w-100 mt-2">
                        <div className="col-md-2 mb-2 text-center d-flex">
                            <img src="/kiis-stroke.png" width={50} className="mr-2" />
                            <Link className="navbar-brand" to="/">{this.state.title}</Link>
                        </div>
                        <div className="col-md-8 mb-2">
                            
                        </div>
                        <div className="col-md-2 mb-2 text-center">
                            { !this.authService.loggedIn?
                            <Link to="/login" className="btn btn-primary">
                               <i className="fas fa-sign-in-alt mr-2"/> Login
                            </Link>
                            : 
                            <UserSection user={this.authService.loggedUser}/> }

                        </div>
                    </div>

                </div>
            </nav>
        )

    }
}



export default commonWrapper(HeaderView);


