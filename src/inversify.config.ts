import { Container } from 'inversify'
import 'reflect-metadata'
import DialogService from './services/DialogService';
import RoutingService from './services/RoutingService';
import AuthService from './services/AuthService';
import MasterDataService from './services/MasterDataService';
import RestClient from './apiClients/RestClient';
import EventService from './services/EventService';
import LoadingService from './services/LoadingService';
import ToastService from './services/ToastService';
import ClassMemberService from './services/ClassMemberService';
import FileUploadService from './services/FileUploadService';

let container:Container = new Container();

container.bind(EventService).toSelf().inSingletonScope();
container.bind(RestClient).toSelf().inSingletonScope();
container.bind(AuthService).toSelf().inSingletonScope();
container.bind(MasterDataService).toSelf().inSingletonScope();
container.bind(RoutingService).toSelf().inSingletonScope();
container.bind(ClassMemberService).toSelf().inSingletonScope();
container.bind(FileUploadService).toSelf().inSingletonScope();

// dialogs
container.bind(DialogService).toSelf().inSingletonScope();
container.bind(LoadingService).toSelf().inSingletonScope();
container.bind(ToastService).toSelf().inSingletonScope();

export {container}
