import React, { ChangeEvent, Component } from "react";

export default abstract class ControlledComponent<P,S > extends Component<P,S>
{
    handleInputChange = (e:ChangeEvent, callback?:(val:any)=>any) => {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement)
        {
            const input:HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement = e.target;
            const state = this.state as any;
            const id = input.id;
            if (!state)
            {
                return;
            }
            let value:any;
            if (input.type == "number")
            {
                value = input.value;
                // try {
                //     value = parseInt(input.value);
                // } catch (e)
                // {
                //     return;
                // }
            }
            else if (input.type == "checkbox" && input instanceof HTMLInputElement)
            {
                value = input.checked;
            }
            else
            {
                value = input.value;
            }

            // assign to specific field
           
            const name      = input.name;
            let rawName     = name.split(".");
            let obj         = state;
            
            rawName.forEach((key, index) => {
                if (obj && index < rawName.length - 1)
                {
                    obj = obj[key];
                }
                if ( index == rawName.length - 1 )
                {
                    obj[key] = value;
                }
            });
            
            // state[input.name] = value;
            this.setState(state, () => {
                if (id)
                {
                    const el = document.getElementById(id);
                    if (el)
                    {
                        el.focus();
                    }
                }
                if (callback)
                {
                    callback(value);
                }
            });
        }
        
    }
}