
import { id } from 'inversify';
import { resolve } from 'inversify-react';
import { Component, ReactNode } from 'react';
import AnchorButton from './components/buttons/AnchorButton';
import ToastMode from './constants/ToastMode';
import ToastComponent from './interfaces/ToastComponent';
import { invokeLater } from './utils/eventUtil';
import ToastService from './services/ToastService';


type ToastItem = {
    id: number;
    message: string;
    mode: ToastMode;
    duration: number;
}
type State = {
    items: ToastItem[]
}

export default class ToastContainer extends Component<any, State> implements ToastComponent {
    
    @resolve(ToastService)
    private service: ToastService;

    static ToastId:number = 1;

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
        const id = ToastContainer.ToastId++;
        items.push({
            id: id,
            message: message,
            mode: mode,
            duration: duration
        });
        this.setState({ items: items }, ()=> {
            invokeLater(() => {
                this.closeToast(id)
            }, duration);
        });
    }
    closeToast = (id:number) => {
        const { items } = this.state;
        for (let i = 0; i < items.length; i++) {
            const element = items[i];
            if (element.id === id) {
                items.splice(i, 1);
                this.setState({ items: items });
                break;
            }            
        }
    }
    render(): ReactNode {
        return (
             <div className="toast-custom ">
                {this.state.items.map((item, i) => {
                    return <Toast key={"toast-"+i} item={item} onClose={this.closeToast} />
                })}
             </div>
        )
    }
}

const Toast = (props: {item: ToastItem, onClose:(id:number) => any}) => {
    return (
        <div className='toast show mb-2'>
            <div 
                className={`alert alert-${props.item.mode} mb-0 d-flex`}
                style={{ flexWrap: 'nowrap', alignItems: 'center'}}
            >
                <p style={{ margin: 'auto' }}>{props.item.message}</p>
                <AnchorButton 
                    iconClass='fas fa-times' 
                    className='btn btn-text btn-sm ms-3' 
                    onClick={(e) => props.onClose(props.item.id)}
                />
            </div>
        </div>
    )
}