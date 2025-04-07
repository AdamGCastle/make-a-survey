import React, { useState } from 'react';
import { useDialogue } from './DialogueContext';
import { useNavigate } from 'react-router-dom';

const DialogueBox = () => {
    const { dialogueBox, closeDialogue } = useDialogue();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    if (!dialogueBox.show) {
        return null;
    }

    const handleConfirm = async () => {
        if (dialogueBox.onConfirm) {
            setIsLoading(true);
            try {
                await dialogueBox.onConfirm();
            } catch (error) {
                console.error("Error:", error);
            }

            setIsLoading(false);
        }

        closeDialogue();
    };

    const handleClose = () => {
        closeDialogue();

        if(!dialogueBox.isQuestion && dialogueBox.onOkNavigationRoute !== null && dialogueBox.onOkNavigationRoute !== '') {
            navigate(dialogueBox.onOkNavigationRoute);
        }
    };

    return (
        <div className="overlay p-2 text-center">
            <div className="dialog">
                <div className="dialog__content">
                    <h2 className="dialog__title">{dialogueBox.title}</h2>
                    <p className="dialog__description">{dialogueBox.message}</p>
                </div>
                <div className="row justify-content-center">
                    {dialogueBox.isQuestion ? (          
                        <div className="col">                          
                            <button onClick={handleConfirm} className={`btn btn-sm btn-secondary me-3 mb-3 w-25 ${isLoading ? "disabled" :""}`}>Yes</button>
                            <button onClick={handleClose} className={`btn btn-sm btn-secondary me-3 mb-3 w-25 ${isLoading ? "disabled" :""}`}>No</button>
                        </div>
                    ) : (
                        <div className="col">
                            <button onClick={handleClose} className={`btn btn-sm btn-secondary mb-3 w-25 ${isLoading ? "disabled" :""}`}>OK</button>
                        </div>
                    )}
                    {isLoading && <div className="d-flex justify-content-center mb-3">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    }                               
                </div>
            </div>
        </div>
    );
};

export default DialogueBox;
