import React from 'react';

const Error = (props)=>{
    return(
                    <div className="error-message">
                        {props.mensaje}
                    </div>
    )
}

export default Error;