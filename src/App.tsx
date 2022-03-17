import React, { Component, Fragment, ReactElement, RefObject } from 'react';
import './App.scss'; 
import { Routing } from './layout/Routing';
import { useLocation, Location } from 'react-router-dom';
import { resolve } from 'inversify-react';
import HeaderView from './layout/HeaderView';
import Dialog from './components/dialog/Dialog';
import { DialogType } from './constants/DialogType';
import DialogService from './services/DialogService';
import { Chart as ChartJS, CategoryScale, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
 
import DialogProps from './models/DialogProps';
import AuthService from './services/AuthService';
import { invokeLater } from './utils/eventUtil';
import { useNavigate } from 'react-router-dom';
import { NavigateFunction } from 'react-router-dom';
import RoutingService from './services/RoutingService';
import Loading from './components/loading/Loading';
import ToastContainer from './components/toast/ToastContainer';
import DialogContainer from './components/dialog/DialogContainer';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);



function App() {
  const loc:Location = useLocation();
  const navigate:NavigateFunction = useNavigate();
  return (
    <Fragment>
      <HeaderView currentLocation={loc}/>
      <Root navigate={navigate}/>
    </Fragment>
  );
}

class State  {
  loaded:boolean = false;
  loadingError:boolean = false;
}
class Root extends Component<{navigate:NavigateFunction},State> {
  @resolve(AuthService)
  private authService:AuthService;
  @resolve(RoutingService)
  private routingService:RoutingService;

  state: Readonly<State> =new State();

  componentDidMount()
  {
    this.routingService.setNavigate(this.props.navigate);
    invokeLater(this.load, 100);
  }
  load = () => {
    this.setState({ loadingError: false });
    
    this.authService.loadApplication()
      .then(()=>{
        this.setState({ loaded: true });
      })
      .catch((e)=>{
        console.error(e);
        this.setState({ loadingError: true });
      })
  }

  render(): React.ReactNode {

    if (this.state.loadingError === true)
    {
      return (
        <div className='w-100 text-center'>
          <h3 className="mt-5 text-danger">Error while loading content</h3>
          <a className='btn btn-outline-dark btn-sm' onClick={this.load}>
            <i className='fas fa-redo me-3'></i>
            Reload
          </a>
        </div>
      )
    }
    if (this.state.loaded === false)
    {
      return (<h3 className='mt-5 text-center text-secondary'>Loading content</h3>)
    }

    return (
      <Fragment>
        <DialogContainer/>
        <ToastContainer />
        <Routing />
        <Loading />
      </Fragment>
    )
  }
}
export default App;
