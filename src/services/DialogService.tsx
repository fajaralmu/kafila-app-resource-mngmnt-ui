import "reflect-metadata"
import { injectable } from "inversify";
import React, { Component, createElement,   ReactElement } from "react"; 
import DialogPrompt from "../components/containers/DialogPrompt";
import { DialogType } from "../constants/DialogType";
import DialogProps from "../models/DialogProps";
import { DialogContainer } from '../App';
import { invokeLater } from "../utils/eventUtil";

const 
    LABEL_INFO      = "Information", 
    LABEL_WARNING   = "Warning", 
    LABEL_ERROR     = "Error", 
    LABEL_CONFIRM   = "Confirmation";

@injectable()
export default class DialogService
{
    private container:DialogContainer;
    public setContainer = (container:DialogContainer) => {
        this.container = container;
    }
    public showInfo = (title:string, message:string) => {
        if (this.container.isShown)
        {
            invokeLater(()=>{
                this.showInfo(title, message)
            }, 100);
            return;
        }
        this.container.show(
            DialogType.INFO,
            title,
            message,
            true,
            console.info
        );
    }
    public showWarning = (title:string, message:string) => {
        if (this.container.isShown)
        {
            invokeLater(()=>{
                this.showWarning(title, message)
            }, 100);
            return;
        }
        this.container.show(
            DialogType.WARNING,
            title,
            message,
            true,
            console.info
        );
    }
    public showError = (title:string, message:string|Error) => {
        if (this.container.isShown)
        {
            invokeLater(()=>{
                this.showError(title, message)
            }, 100);
            return;
        }
        this.container.show(
            DialogType.ERROR,
            title,
            message instanceof Error ? message.message : message.toString(),
            true,
            console.error
        );
        
    }

    public showConfirmDanger = (title:string, message:string) => {
        return this.showConfirm(title, message, DialogType.ERROR);
    }
    public showConfirmWarning = (title:string, message:string) => {
        return this.showConfirm(title, message, DialogType.WARNING);
    }

    public showConfirm = (title:string, message:string, type:DialogType = DialogType.INFO) => {

        return new Promise<boolean>((resolve, reject)=>{
            this.container.show(
                type,
                title,
                message,
                false,
                (e:any) => {
                    resolve(true);
                },
                (e:any) => {
                    resolve(false);
                }
            );
        });
    }
   
    public showPrompt = ( title:string, message:string, defaultValue?:string ) => {
        
        return new Promise<string|undefined>((resolve,reject)=>{
            this.doShowPrompt(title, message, resolve, defaultValue);
        });
    }

    private doShowPrompt = ( title:string, message:string, resolve:(e:any)=>any, defaultValue?:string ) =>
    {
        if (this.container.isShown)
        {
            invokeLater(()=>{
                this.doShowPrompt(title, message,  resolve, defaultValue);
            }, 100);
            return;
        }
        const onSubmit = (val:string)=>{
            this.dismissAlert();
            resolve(val);
        };
        this.container.showNoButtons( 
            title,
            <DialogPrompt
                message={message}
                onSubmit={onSubmit}
                defaultValue={defaultValue}/>,
            (e:any) => { resolve(undefined) }, 
        );
    }

    public dismissAlert = () => {
        this.container.dismissAlert();
    }

    public showContent = ( title:string, content: ReactElement<any, typeof Component> ) => {
        return new Promise<boolean>((resolve, reject) => {
            let el = createElement(content.type, content.props);
            this.container.showNoButtons(  title, el, (e:any) => { resolve(false) }  );
        });
    }
} 

interface DialogPromptProps 
{
    message:string,
    onChange:(val:string)=>any
}