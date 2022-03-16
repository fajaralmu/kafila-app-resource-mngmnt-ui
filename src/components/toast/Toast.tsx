
import { Component, ReactNode } from 'react';
import AnchorButton from '../buttons/AnchorButton';
import ToastItem from './ToastItem';
import { invokeLater } from './../../utils/eventUtil';

type Props = {
    item: ToastItem,
    onClose: (id: number) => any,
}

type State = {
    opacity: number,
}

const TRANSITION_DURATION = 300;

export default class Toast extends Component<Props, State> {
    constructor(props:Props) {
        super(props);
        this.state = {
            opacity: 1,
        };
    }
    onClose = () => {
        this.setState({ opacity: 0 }, () => {
            invokeLater(() => this.props.onClose(this.props.item.id), TRANSITION_DURATION);
        })
    }
    render(): ReactNode {
        const { item } = this.props;
        const { opacity } = this.state;
        return (
            <div className='toast show mb-2' style={{  opacity: opacity, transitionDuration: `${TRANSITION_DURATION}ms` }}>
                <div 
                    className={`alert alert-${item.mode} mb-0 d-flex`}
                    style={{ flexWrap: 'nowrap', alignItems: 'center'}}
                >
                    <p style={{ margin: 'auto' }}>{item.message}</p>
                    <AnchorButton 
                        iconClass='fas fa-times' 
                        className='btn btn-text btn-sm ms-3' 
                        onClick={(e) => this.onClose()}
                    />
                </div>
            </div>
        )
    }
}