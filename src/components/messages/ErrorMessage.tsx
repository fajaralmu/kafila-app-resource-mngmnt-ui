const ErrorMessage = (props:{children:any, show?:boolean}) => {

    if (props.show === false)
    {
        return null;
    }
    return (
        <div className="alert alert-danger">
            {props.children}
        </div>
    )
}

export default ErrorMessage;