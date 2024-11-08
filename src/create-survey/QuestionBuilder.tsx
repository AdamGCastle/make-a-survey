import { ChangeEvent, FunctionComponent } from "react";
import { useState } from "react";
import AnswerBuilder from "./AnswerBuilder"
import { IQuestion, IMultipleChoiceOption } from "./models";
import Button from 'react-bootstrap/Button';
//import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';

interface IQuestionUpdatedFunction{
    (updatedQuestion: IQuestion): void
}

interface IRemoveQuestionFunction{
     (questionNum: number): void
}

interface QuestionBuilderProps{
    questionNumber: number,
    onQuestionUpdated: IQuestionUpdatedFunction
    removeQuestion : IRemoveQuestionFunction 
    initialQuestionValue: IQuestion
}

//props down (prop drilling)
//events up

const QuestionBuilder: FunctionComponent<QuestionBuilderProps> = ({questionNumber, onQuestionUpdated, removeQuestion, initialQuestionValue}) => {

    const [myQuestion, setQuestion] = useState<IQuestion>(initialQuestionValue);
    const questionTextChanged = (elem: ChangeEvent<HTMLInputElement>) => {        
        const value = elem.target.value;  
        const copyOfMyQuestion = {...myQuestion}; 
        copyOfMyQuestion.text = value;
        setQuestion(copyOfMyQuestion);
        onQuestionUpdated(copyOfMyQuestion);
    }

    const checkboxChanged = (e: ChangeEvent<HTMLInputElement>, checkboxName: string) => {
        const copyOfMyQuestion = { ...myQuestion };
        if(checkboxName === 'isMultipleChoice') {
            copyOfMyQuestion.isMultipleChoice = e.target.checked;
        } else if (checkboxName === 'multipleAnswersPermitted') {
            copyOfMyQuestion.multipleAnswersPermitted = e.target.checked;
        }

        setQuestion(copyOfMyQuestion);
        onQuestionUpdated(copyOfMyQuestion);
    };
   
    const addAnswer = () => {        
        const copyOfMyQuestion = {...myQuestion};
        const newKey = Math.random();
        copyOfMyQuestion.multipleChoiceOptions.push({key: newKey, text: '', id: newKey});
        
        setQuestion(copyOfMyQuestion);
    }

    const removeAnswer = (answerID: number) => {
        const copyOfMyQuestion = {...myQuestion};
        const indexOfAnswer = copyOfMyQuestion.multipleChoiceOptions.findIndex(a => a.id === answerID);
        copyOfMyQuestion.multipleChoiceOptions.splice(indexOfAnswer,1);
        console.log(copyOfMyQuestion);
        
        setQuestion(copyOfMyQuestion);  
        onQuestionUpdated(copyOfMyQuestion); 
    }

    const onAnswerUpdated = (answer: IMultipleChoiceOption, index: number) => {
        const copyOfNewQuestion = {...myQuestion};        
        copyOfNewQuestion.multipleChoiceOptions[index] = answer;

        setQuestion(copyOfNewQuestion);
        onQuestionUpdated(copyOfNewQuestion);        
    }

    return (
        <div >
            <br/>
            <div className="questionBox">
                <h5 className="alignCentre">Question {questionNumber}: </h5>   
                <div className="row mt-3">
                    <div className="col-9">
                        <input 
                            type="text" 
                            placeholder="Enter question" 
                            className="text-input font-size-sm me-3 mb-3" 
                            id={'q' + questionNumber} 
                            onChange={questionTextChanged} 
                            value={myQuestion.text}
                            key={'q' + questionNumber}
                        />
                    </div>
                    <div className="col">
                        <Button variant="danger" className="btn btn-sm" onClick={() => removeQuestion(questionNumber)}>Remove</Button>    
                    </div>
                </div>             
                
                <div className="mt-3">
                <label className="text-sm me-3">Multiple choice: </label>                
                    <input 
                        type="checkbox"
                        id="multipleChoiceCheckbox"
                        className="form-check-input"
                        defaultChecked={myQuestion.isMultipleChoice} 
                        onChange={e => checkboxChanged(e, 'isMultipleChoice')}
                        key={'multipleChoice' + questionNumber}
                    />
                </div>
                { myQuestion.isMultipleChoice && (
                    <div id="multipleChoiceDiv">
                        {
                            myQuestion.multipleChoiceOptions.map((a, index) => (                        
                                <AnswerBuilder
                                    key={a.id} 
                                    answerNumber={index+1} 
                                    onAnswerUpdated={(answer: IMultipleChoiceOption) => onAnswerUpdated(answer, index)}
                                    removeAnswer={() => removeAnswer(a.id)}
                                    initialAnswerValue={a}                      
                                />         
                            ))
                        }

                        <Button 
                            className=" btn-sm mt-3" 
                            variant="success" 
                            size="sm"
                            style={{display: myQuestion.multipleChoiceOptions.length >= 26 ? "none" : "inline-block"}}
                            onClick={() => addAnswer()}
                        >
                            Add Answer
                        </Button>
                        <br/>
                        <br/>
                        <label className="me-2">Let users select multiple answers: </label>
                        <input 
                            type="checkbox"
                            id="multipleAnswersPermittedCheckbox"
                            className="form-check-input"
                            defaultChecked={myQuestion.multipleAnswersPermitted}
                            onChange={e => checkboxChanged(e, 'multipleAnswersPermitted')}
                            key={'multipleAnswersPermitted' + questionNumber}
                        />
                    </div>
                )}
                <br/>                
            </div>            
        </div>
    )
}

export default QuestionBuilder;