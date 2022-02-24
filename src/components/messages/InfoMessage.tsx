const InfoMessage = (props:{children:any, show?:boolean}) => {

    if (props.show === false)
    {
        return null;
    }
    return (
        <div className="alert alert-info">
            {props.children}
        </div>
    )
}

export default InfoMessage;