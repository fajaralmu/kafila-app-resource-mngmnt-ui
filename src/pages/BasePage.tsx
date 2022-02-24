import React from "react";
import { resolve } from "inversify-react";
import BaseProps from "../models/BaseProps";
import BaseState from "../models/BaseState"; 
import ControlledComponent from "./ControlledComponent";
import Settings from './../settings';
import DialogService from './../services/DialogService';
import { ViewTemplate } from "../layout/ViewTemplate";
import AuthService from './../services/AuthService';

export abstract class BasePage<P extends BaseProps,S extends BaseState> extends ControlledComponent<P, S>
{
    title?:string;
    @resolve(AuthService)
    protected authService:AuthService;
    @resolve(DialogService)
    protected dialog:DialogService;

    constructor(props:P, private authorized:boolean = false, title?:string)
    {
        super(props);
        this.title = title;
        this.initialize();
    }
    initialize = () => {
        document.title = this.title ? this.title : Settings.App.uiSetting.defaultTitle;
    }

    componentDidMount()
    {
        this.forceUpdate();
    }

    componentDidUpdate()
    {
        if (this.authorized && !this.authService.loggedIn )
        {   
            this.navigate("/");
            return;
        }
    }

    protected navigate = (url:string) =>
    {
        if (this.props.navigate)
        {
            this.props.navigate(url);
            return;
        }
        console.error("props.navigate does not exist");
    }

    protected gotoHomePage = () => {
        this.navigate("/");
    }

    
    protected invalidSession = () => 
    {
        return (
            <ViewTemplate title="Invalid Session">
                <p>You must log in to access this page</p>
            </ViewTemplate>
        )
    }
    
}
 
