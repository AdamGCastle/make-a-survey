import { ChangeEvent, FunctionComponent, useState } from "react";
import { IMultipleChoiceOption } from "./models";
import Button from 'react-bootstrap/Button';
import React from 'react';


interface IMultipleChoiceOptionUpdatedFunction{
    (updatedAnswer: IMultipleChoiceOption, 
        ): void
}

interface IRemoveAnswerFunction{
    (answerNum: number): void;
}

interface AnswerBuilderProps{
    answerNumber: number,
    onAnswerUpdated: IMultipleChoiceOptionUpdatedFunction,
    removeAnswer: IRemoveAnswerFunction,   
    initialAnswerValue: IMultipleChoiceOption    
}

const AnswerBuilder: FunctionComponent<AnswerBuilderProps> = ({ answerNumber, onAnswerUpdated, removeAnswer, initialAnswerValue}) => {

    const [myAnswer, setAnswer] = useState<IMultipleChoiceOption>(initialAnswerValue);
    const answerLetter = answerNumber < 1 || answerNumber > 26 ? null : String.fromCharCode(96 + answerNumber)

    const answerTextChanged = (elem: ChangeEvent<HTMLInputElement>) => {

        const value = elem.target.value;        
        const copyOfMyAnswer = {...myAnswer};
        copyOfMyAnswer.text = value;         
        setAnswer(copyOfMyAnswer);
        onAnswerUpdated(copyOfMyAnswer);        
    }

    return (        
        <div className="row ms-2 mt-3 mb-2">
            <div className="col-lg-2 col-md-2 col-sm-8">
                <span className="text-sm me-3">{answerLetter})</span>
            </div>
            <div className="col-10">
                <input 
                    type="text" 
                    placeholder="Enter answer" 
                    className="text-input text-sm me-3" 
                    id={'a' + answerNumber} 
                    value = {myAnswer.text} 
                    onChange={answerTextChanged} 
                />
            
                <Button 
                    className="btn btn-sm btn-danger mt-3" 
                    onClick={() => removeAnswer(myAnswer.id)}>Remove</Button>
            </div>
        </div>
    )

}

export default AnswerBuilder;