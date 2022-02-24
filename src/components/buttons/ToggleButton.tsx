import React, { Component, Fragment } from 'react' 

import './ToggleButton.css'

interface Props {
    onClick(val:boolean):void,
    active:boolean, 
    disabled?:boolean
}
export default class ToggleButton extends Component<Props, any>{
    
    onClick = () => {
        if (this.props.disabled == true)
        {
            return;
        }
        this.props.onClick(!this.props.active);
    }

    render() {
        const active = this.props.active;
        return (
            <Fragment>
                <div className='toggleButtonContainer'
                     style={{backgroundColor: active?'darkgreen':'darkgray'}}
                     onClick={(e) => this.onClick()} >

                    <div className='bg-light toggleButtonPointer'
                         style={{marginLeft:active?16:0}}
                        >

                    </div>
                </div>
            </Fragment>
        )
    }
}