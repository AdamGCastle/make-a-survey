import React, { FunctionComponent } from "react";
import { IDialogueBox } from "../create-survey/models";
import { useNavigate } from "react-router-dom";

// interface DialogueBoxProps{       
//     initialDialogueBoxValue: IDialogueBox
// }

const DeleteSurvey : FunctionComponent<IDialogueBox> = ({show, title, message, confirm, close, isQuestion, onOkNavigationRoute}) => {
    const navigate = useNavigate();
    const onOkClicked = () => {
        close();

        if(onOkNavigationRoute != null && onOkNavigationRoute != '') {
            console.log('on ok of dialogue clicked. Navigating to ' + onOkNavigationRoute);

            navigate(onOkNavigationRoute, { replace: true});
        }
    }

    if(! show){
        return <></>;
    }

    else {
        return(
            <div className="overlay">
                <div className="dialog">
                    <div className="dialog__content">
                        <h2 className="dialog__title">{title}</h2>
                        <p className="dialog__description">{message}</p>
                    </div>
                    {isQuestion ? (
                        <p>
                            <button onClick={confirm} className="btn btn-sm btn-secondary me-3 mb-3">Yes</button>
                            <button onClick={close} className="btn btn-sm btn-secondary me-3 mb-3">No</button>
                        </p>
                    ) : (
                        <p>
                            <button onClick={onOkClicked} className="btn btn-sm btn-secondary me-3 mb-3">OK</button>
                        </p>
                    )}
                </div>
            </div>
        )
    }
};

export default DeleteSurvey;