

import { resolve } from 'inversify-react';
import { Component, ReactNode } from 'react';
import LoadingService from './services/LoadingService';
import LoadingComponent from './interfaces/LoadingComponent';
type State = {
    show: boolean;
}
export default class Loading extends Component<any, State> implements LoadingComponent {
    
    @resolve(LoadingService)
    private service:LoadingService;

    constructor(props:any) {
        super(props);
        this.state = {
            show: false
        }
    }
    startLoading() {
        this.setState({ show: true });
    }
    stopLoading() {
        this.setState({ show: false });
    }
    componentDidMount() {
        this.service.setComponent(this);
    }
    render(): ReactNode {
        if (!this.state.show) {
            return null;
        }
        return (
            <div className='loading bg-info border border-dark rounded px-2 py-1 text-center'>
                <div className='text-light'>Loading</div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 8" width="120" height="8">
                    <path fill="none" strokeWidth="8" stroke="blue" d="M 5 4 L 5 4 L 115 4 " />
                    <path className='loading-bar' fill="none" strokeWidth="6" stroke="yellow" d="M 6 4 L 6 4 L 114 4 " />
                </svg>

            </div>
        )
    }
}