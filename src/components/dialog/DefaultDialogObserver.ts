import { DialogObserver } from './DialogObserver';

export default class DefaultDialogObserver implements DialogObserver {
    private constructor(){
        //
    }
    close = () => {}
    static create = () => new DefaultDialogObserver();
}