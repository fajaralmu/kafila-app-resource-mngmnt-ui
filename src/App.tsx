import React, { Component, Fragment, ReactElement, RefObject } from 'react';
import './App.css'; 
import { Routing } from './layout/Routing';
import { useLocation, Location } from 'react-router-dom';
import { resolve } from 'inversify-react';
import HeaderView from './layout/HeaderView';
import Dialog from './components/containers/Dialog';
import { DialogType } from './constants/DialogType';
import DialogService from './services/DialogService';
import { Chart as ChartJS, CategoryScale, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
 
import DialogProps from './models/DialogProps';
import AuthService from './services/AuthService';
import { invokeLater } from './utils/eventUtil';
import { useNavigate } from 'react-router-dom';
import { NavigateFunction } from 'react-router-dom';
import RoutingService from './services/RoutingService';

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

class State 
{
  loaded:boolean = false;
  loadingError:boolean = false;
}
class Root extends Component<{navigate:NavigateFunction},State>
{
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

    if (this.state.loadingError == true)
    {
      return (
        <div className='w-100 text-center'>
          <h3 className="mt-5 text-danger">Error while loading content</h3>
          <a className='btn btn-outline-dark btn-sm' onClick={this.load}>
            <i className='fas fa-redo mr-3'></i>
            Reload
          </a>
        </div>
      )
    }
    if (this.state.loaded == false)
    {
      return (<h3 className='mt-5 text-center text-secondary'>Loading content</h3>)
    }

    return (
      <Fragment>
        <DialogContainer/>
        <Routing />
      </Fragment>
    )
  }
}
class DialogState
{
  show:boolean = false;
}
export class DialogContainer extends Component<any,DialogState>
{
  state: Readonly<DialogState> = new DialogState();
  
  // dialog props
  dialogTitle:string;
  dialogContent:any;
  dialogYesOnly:boolean;

  yesLabel:string = "Yes";

  dialogOnConfirm:(e:any) => any;
  dialogOnCancel:(e:any) => any;

  onCloseCallback?:(e:any)=>any;

 
  
  dialogType:DialogType = DialogType.INFO;

  @resolve(DialogService)
  private dialogService:DialogService;
  private ref:RefObject<Dialog> = React.createRef();

  constructor(props:any)
  {
    super(props);
  }

  // fired when confirmed/canceled
  public dismissAlert = () => {
    if (this.ref.current)
    {
      this.ref.current.close(()=>{
        this.setState({show:false});
      })
      return;
    }
    this.setState({show:false});
  } 
  
  // fired when pressing [X] button
  dialogOnClose = (e:any) => {
    
    this.setState({show: false}, ()=>{
      if (this.onCloseCallback)
      {
        this.onCloseCallback(e);
      }

      this.resetProps();
    });
  }
  setContent(content:ReactElement<DialogProps, typeof Component >)
  {
    this.dialogContent = content;
    this.forceUpdate();
  }
  componentDidMount()
  {
    this.dialogService.setContainer( this );
  }
  resetProps = () => {
    this.onCloseCallback  = undefined;
    this.yesLabel         = "Yes";
  }
  get isShown() { return this.state.show }
  
  public showNoButtons = ( title:string, content:any,  onClose:(e:any) => any, closeObj?:{close:()=>any} ) => {
    this.dialogType     = DialogType.INFO_NO_BUTTONS;
    this.dialogTitle    = title;
    this.dialogContent  = content; 
    if (closeObj)
      closeObj.close      = this.dismissAlert;

    this.display();
  }
  public show = (
    type:DialogType,
    title:string,
    content:any,
    yesOnly:boolean,
    onConfirm:(e:any) => any,
    onCancel?:(e:any) => any,
    yesLabel?:string
  ) => {
     
    this.dialogType     = type;
    this.dialogTitle    = title;
    this.dialogContent  = content;
    this.dialogYesOnly  = yesOnly;
    this.yesLabel       = yesLabel ? yesLabel : this.yesLabel;

    this.dialogOnConfirm = (e:any) => {
      this.dismissAlert();
      onConfirm(e);
    }
    this.onCloseCallback = onCancel;
    if (!yesOnly) {
      
      this.dialogOnCancel = (e:any) => {
        this.dismissAlert();
        if (onCancel) {
          onCancel(e);
        }
      };
    }
    this.display();
  }

  display()
  {
    this.setState({ show: true });
  } 

  render(): React.ReactNode {
      
    return (
      this.state.show? 
      <Dialog 
        ref={this.ref}
        title={this.dialogTitle}
        yesOnly={this.dialogYesOnly}
        onConfirm={this.dialogOnConfirm}
        onCancel={this.dialogOnCancel}
        onClose={this.dialogOnClose}
        type={this.dialogType}
        
        yesLabel={this.yesLabel}
      >
        {this.dialogContent}
      </Dialog> : null
    );
  }
}

export default App;
