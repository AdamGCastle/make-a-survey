import React, { FunctionComponent } from "react";
import { IDialogueBox } from "../create-survey/models";
import { useNavigate } from "react-router-dom";

const DeleteSurvey : FunctionComponent<IDialogueBox> = ({show, title, message, confirm, close, isQuestion, onOkNavigationRoute}) => {
    const navigate = useNavigate();
    const onOkClicked = () => {
        close();

        if(onOkNavigationRoute !== null && onOkNavigationRoute !== '') {
            navigate(onOkNavigationRoute, { replace: true});
        }
    }

    if(! show){
        return <></>;
    }

    else {
        return(
            <div className="overlay p-2">
                <div className="dialog">
                    <div className="dialog__content">
                        <h2 className="dialog__title">{title}</h2>
                        <p className="dialog__description">{message}</p>
                    </div>
                    <div className="row justify-content-center">                            
                                {isQuestion ? (          
                                    <div className="col">                          
                                        <button onClick={confirm} className="btn btn-sm btn-secondary me-3 mb-3 w-25">Yes</button>
                                        <button onClick={close} className="btn btn-sm btn-secondary me-3 mb-3 w-25">No</button>
                                    </div>
                                ) : (
                                    <div className="col">
                                        <button onClick={onOkClicked} className="btn btn-sm btn-secondary mb-3 w-75">OK</button>
                                    </div>
                                )}
                            
                        </div>
                </div>
            </div>
        )
    }
};

export default DeleteSurvey;