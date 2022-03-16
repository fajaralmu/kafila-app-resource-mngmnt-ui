import ToastMode from "../../constants/ToastMode";

type ToastItem = {
    id: number;
    message: string;
    mode: ToastMode;
    duration: number;
}
export default ToastItem;