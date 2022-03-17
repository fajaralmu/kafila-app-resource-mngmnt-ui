

import { resolve } from 'inversify-react';
import { Component, ReactNode } from 'react';
import LoadingService from '../../services/LoadingService';
import LoadingComponent from '../../interfaces/LoadingComponent';
import './Loading.scss';
import { invokeLater } from './../../utils/eventUtil';

const TRANSITION_DURATION = 300;
const ACTIVE_OPACITY = 0.7;
type State = {
    show: boolean;
    opacity: number;
}

export default class Loading extends Component<any, State> implements LoadingComponent {
    
    @resolve(LoadingService)
    private service:LoadingService;

    constructor(props:any) {
        super(props);
        this.state = {
            show: false,
            opacity: 0,
        }
    }
    startLoading() {
        this.setState({ show: true, opacity: ACTIVE_OPACITY });
    }
    stopLoading() {
        this.setState({ opacity: 0 }, () => {
           invokeLater(() => this.setState({ show: false }), 300);
        });
    }
    componentDidMount() {
        this.service.setComponent(this);
    }
    render(): ReactNode {
        if (!this.state.show) {
            return null;
        }
        const outerSize = 14;
        const innerSize = 12;
        const transitionDuration = `${TRANSITION_DURATION}ms`;
        return (
            <div 
                className='loading bg-secondary border border-secondary rounded px-2 py-1 text-center'
                style={{ opacity: this.state.opacity, transitionDuration: transitionDuration }} 
            >
                <h3 className='text-light'>Loading</h3>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 120 ${outerSize}`} width="120" height={outerSize}>
                    <path 
                        className='loadingBarContainer' 
                        fill="none" 
                        strokeWidth={outerSize} 
                        d={`M 5 ${outerSize/2} L 5 ${outerSize/2} L 115 4 `} 
                    />
                    <path 
                        className='loadingBar' 
                        fill="none" 
                        strokeWidth={innerSize}
                        d={`M 6 ${outerSize/2} L 6 ${outerSize/2} L 114 4 `} 
                    />
                </svg>

            </div>
        )
    }
}