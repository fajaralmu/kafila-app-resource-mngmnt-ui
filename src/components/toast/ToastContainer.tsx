
import { id } from 'inversify';
import { resolve } from 'inversify-react';
import { Component, ReactNode, RefObject } from 'react';
import AnchorButton from '../buttons/AnchorButton';
import ToastMode from '../../constants/ToastMode';
import ToastComponent from '../../interfaces/ToastComponent';
import { invokeLater } from '../../utils/eventUtil';
import ToastService from '../../services/ToastService';
import ToastItem from './ToastItem';
import Toast from './Toast';
import React from 'react';



type State = {
    items: ToastItem[]
}

export default class ToastContainer extends Component<any, State> implements ToastComponent {
    
    @resolve(ToastService)
    private service: ToastService;

    static ToastId:number = 1;

    private toastRefs: Map<number, RefObject<Toast>> = new Map();

    constructor(props:any) {
        super(props);
        this.state = {
            items: []
        }
    }
    componentDidMount() {
        this.service.setComponent(this);
    }
    show = (message: string, mode: ToastMode, duration: number = 5000) => {
        const { items } = this.state;
        const id = ToastContainer.ToastId;
        items.push({
            id: id,
            message: message,
            mode: mode,
            duration: duration
        });
        this.setState({ items: items }, ()=> {
            invokeLater(() => {
                const current = this.getRef(id)?.current;
                if (current) {
                    current.onClose();
                }
            }, duration);
        });
        ToastContainer.ToastId+=1;
    }
    closeToast = (id:number) => {
        const { items } = this.state;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.id === id) {
                items.splice(i, 1);

                this.toastRefs.delete(item.id);
                this.setState({ items: items });
                break;
            }            
        }
    }
    getRef = (id: number) => {
        if (!this.toastRefs.has(id)) {
            this.toastRefs.set(id, React.createRef());
        }
        return this.toastRefs.get(id);
    }
    render(): ReactNode {
        const { items } = this.state;
        const reversed = items.reverse();
        return (
             <div className="toast-custom">
                {reversed.map((item) => {
                    return (
                        <Toast 
                            ref={this.getRef(item.id)} 
                            key={"toast-"+item.id} 
                            item={item} 
                            onClose={this.closeToast} 
                        />
                    )
                })}
             </div>
        )
    }
}
