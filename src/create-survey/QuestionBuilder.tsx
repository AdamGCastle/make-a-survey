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

    const multipleChoiceChanged = (isMultipleChoice: boolean) => {
        const copyOfMyQuestion = { ...myQuestion, isMultipleChoice };
        
        if(isMultipleChoice && copyOfMyQuestion.multipleChoiceOptions.length == 0){
            const newKey = Math.random();
            copyOfMyQuestion.multipleChoiceOptions.push({key: newKey, text: '', id: newKey});
        }

        setQuestion(copyOfMyQuestion);
        onQuestionUpdated(copyOfMyQuestion);
    };

    const multAnsPermittedChanged = (multipleAnswersPermitted: boolean) => {
        const copyOfMyQuestion = { ...myQuestion, multipleAnswersPermitted };
    
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
            <div className="question-builder">
                <div className="row mb-2">
                    <div className="col-3">
                    </div>
                    <div className="col-6">
                        <h5>Question {questionNumber}</h5> 
                    </div>
                    <div className="col-3">
                        <Button variant="danger" className="btn btn-md btn-delete" onClick={() => removeQuestion(questionNumber)}> <i className="bi bi-trash"></i></Button>  
                    </div>
                </div>
                <div className="row m-3 justify-content-center">    
                    <div className="col col-xl-8">
                    <input 
                        type="text" 
                        placeholder="Enter question" 
                        className="text-input font-size-sm text-center mt-2" 
                        id={'q' + questionNumber} 
                        onChange={questionTextChanged} 
                        value={myQuestion.text}
                        key={'q' + questionNumber}
                    />      
                    </div>              
                    
                </div>     
                <div className="btn-group" role="group">
                    <button
                        type="button"
                        className={`btn ${!myQuestion.isMultipleChoice ? "custom-blue-btn" : "outline-custom-blue-btn"} btn-sm`}
                        onClick={() => multipleChoiceChanged(false)}
                        > Text Response
                    </button>
                    <button
                        type="button"
                        className={`btn ${myQuestion.isMultipleChoice ? "custom-blue-btn" : "outline-custom-blue-btn"} btn-sm`}
                        onClick={() => multipleChoiceChanged(true)}
                        >Multiple Choice
                    </button>
                </div>

                { myQuestion.isMultipleChoice && (
                    <div id="multipleChoiceDiv" className="answer-builder mt-3">
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
                        <div className="row justify-content-center">
                            <div className="col">
                                <button 
                                    className="btn custom-green-btn btn-sm my-2"
                                    style={{display: myQuestion.multipleChoiceOptions.length >= 26 ? "none" : "inline-block"}}
                                    onClick={() => addAnswer()}
                                >
                                    Add Answer
                                </button>
                            </div>
                            
                        </div>
                        <div className="row fw-bold text-center mt-2">
                            <div className="col">
                                Let user pick...
                            </div>
                        </div>
                            <div className="btn-group mt-3" role="group">
                                <button
                                    type="button"
                                    className={`btn ${myQuestion.multipleAnswersPermitted ? "custom-blue-btn" : "outline-custom-blue-btn"} btn-sm`}
                                    onClick={() => multAnsPermittedChanged(true)}
                                    >Many
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${!myQuestion.multipleAnswersPermitted ? "custom-blue-btn" : "outline-custom-blue-btn"} btn-sm`}
                                    onClick={() => multAnsPermittedChanged(false)}
                                    >Only one
                                </button>
                            </div>
                    </div>
                )}           
            </div>            
        </div>
    )
}

export default QuestionBuilder;