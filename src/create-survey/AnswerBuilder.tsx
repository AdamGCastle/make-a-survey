import { ChangeEvent, FunctionComponent, useState } from "react";
import { IMultipleChoiceOption } from "./models";
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
    const answerLetter = answerNumber < 1 || answerNumber > 26 ? null : String.fromCharCode(96 + answerNumber).toLocaleUpperCase()

    const answerTextChanged = (elem: ChangeEvent<HTMLInputElement>) => {

        const value = elem.target.value;        
        const copyOfMyAnswer = {...myAnswer};
        copyOfMyAnswer.text = value;         
        setAnswer(copyOfMyAnswer);
        onAnswerUpdated(copyOfMyAnswer);        
    }

    return (        
        <div className="row mt-3 mb-2">
            <div className="col col-2 answer-letter">
                <span className="text-sm fw-bold">{answerLetter})</span>
            </div>
            <div className="col col-12 col-sm-8">
                <input 
                    type="text" 
                    placeholder="Enter answer" 
                    className="text-input text-sm text-center" 
                    id={'a' + answerNumber} 
                    value = {myAnswer.text} 
                    onChange={answerTextChanged} 
                />
            </div>
            <div className="col col-12 col-sm-2">
                <button className="btn btn-sm btn-danger bi bi-trash mt-1" 
                    onClick={() => removeAnswer(myAnswer.id)}></button>
            </div>
        </div>
    )

}

export default AnswerBuilder;