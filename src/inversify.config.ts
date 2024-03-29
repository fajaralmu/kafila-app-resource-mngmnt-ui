import { Container } from 'inversify';
import 'reflect-metadata';
import RestClient from './apiClients/RestClient';
import AuthService from './services/AuthService';
import ClassMemberService from './services/ClassMemberService';
import DialogService from './services/DialogService';
import EventService from './services/EventService';
import FileUploadService from './services/FileUploadService';
import LoadingService from './services/LoadingService';
import MasterDataService from './services/MasterDataService';
import RoutingService from './services/RoutingService';
import SchoolConfigService from './services/SchoolConfigService';
import ToastService from './services/ToastService';
import DataInsertService from './services/DataInsertService';
import MasterDataServiceV2 from './services/MasterDataServiceV2';
import CalendarEventService from './services/CalendarEventService';

const container = new Container();

container.bind(EventService).toSelf().inSingletonScope();
container.bind(RestClient).toSelf().inSingletonScope();
container.bind(AuthService).toSelf().inSingletonScope();
container.bind(MasterDataService).toSelf().inSingletonScope();
container.bind(RoutingService).toSelf().inSingletonScope();
container.bind(ClassMemberService).toSelf().inSingletonScope();
container.bind(FileUploadService).toSelf().inSingletonScope();
container.bind(SchoolConfigService).toSelf().inSingletonScope();
container.bind(DataInsertService).toSelf().inSingletonScope();
container.bind(MasterDataServiceV2).toSelf().inSingletonScope();
container.bind(CalendarEventService).toSelf().inSingletonScope();

// dialogs
container.bind(DialogService).toSelf().inSingletonScope();
container.bind(LoadingService).toSelf().inSingletonScope();
container.bind(ToastService).toSelf().inSingletonScope();

export { container };

