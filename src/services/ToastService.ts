import { injectable } from "inversify";
import ToastComponent from './../interfaces/ToastComponent';
import ToastMode from './../constants/ToastMode';

@injectable()
export default class ToastService {
    private component: ToastComponent | undefined;
    setComponent = (c: ToastComponent) => {
        this.component = c;
    }
    showInfo(message:string, duration = 5000) {
        this.show(message, 'info', duration);
    }
    showPrimary(message:string, duration = 5000) {
        this.show(message, 'primary', duration);
    }
    showWarning(message:string, duration = 5000) {
        this.show(message, 'warning', duration);
    }
    showDanger(message:string, duration = 5000) {
        this.show(message, 'danger', duration);
    }
    showSuccess(message:string, duration = 5000) {
        this.show(message, 'success', duration);
    }
    show = (message:string, mode:ToastMode, duration = 5000) => {
        this.component?.show(message, mode, duration);
    }
}