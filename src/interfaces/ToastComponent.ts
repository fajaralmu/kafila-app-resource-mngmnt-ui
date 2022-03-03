export default interface ToastComponent {
    show(message:string, mode: 'info' | 'warning' |'success' | 'primary' | 'danger', duration:number) : any;
}