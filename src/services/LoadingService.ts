import { injectable } from "inversify";
import LoadingComponent from './../interfaces/LoadingComponent';

@injectable()
export default class LoadingService {
  startLoading = () => {
    this.component?.startLoading();
  }
  stopLoading = () => {
    this.component?.stopLoading();
  }
  private component: LoadingComponent | undefined;

  setComponent = (c: LoadingComponent) => {
    this.component = c;
  }
}