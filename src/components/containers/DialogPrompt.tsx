import React, { ChangeEvent, FormEvent, ReactNode } from "react";
import ControlledComponent from "../../pages/ControlledComponent";

class State 
{
    content:string = "";
}
interface Props 
{
    message:string,
    defaultValue?:string,
    onSubmit:(val:string)=>any
}
export default class DialogPrompt extends ControlledComponent<Props, State>
{
    state: State = new State();
    inputRef: React.RefObject<HTMLInputElement> = React.createRef();

    constructor(props:Props)
    {
        super(props);
        if (props.defaultValue)
        {
            this.state.content = props.defaultValue;
        }
    }

    onSubmit = (e:FormEvent) => {
        e.preventDefault();
        this.props.onSubmit(this.state.content);
    }
    componentDidMount()
    {
        if (this.inputRef.current)
        {
            this.inputRef.current.focus();
        }
    }
    render(): ReactNode {
        
        return (
            <div>
                <h5>{this.props.message}</h5>
                <form onSubmit={this.onSubmit}>
                    <input 
                        ref={this.inputRef}
                        name="content"
                        value={this.state.content}
                        onChange={this.handleInputChange}
                        className="form-control mb-3" required />
                    <input 
                        type="submit" 
                        className="btn btn-primary" 
                        value={"Ok"} />
                    
                </form>
            </div>
        )
    }
}