import { ChangeEvent, FunctionComponent, useEffect } from "react";
import { useState } from "react";
import AnswerBuilder from "./AnswerBuilder"
import { IQuestion, IMultipleChoiceOption } from "./models";
import Button from 'react-bootstrap/Button';
import React from 'react';

interface IQuestionUpdatedFunction{
    (updatedQuestion: IQuestion): void
}

interface IRemoveQuestionClickedFunction{
     (questionNum: number): void
}

interface QuestionBuilderProps{
    questionNumber: number,
    onQuestionUpdated: IQuestionUpdatedFunction
    onRemoveQuestionClicked : IRemoveQuestionClickedFunction 
    initialQuestionValue: IQuestion
}

const QuestionBuilder: FunctionComponent<QuestionBuilderProps> = ({questionNumber, onQuestionUpdated, onRemoveQuestionClicked, initialQuestionValue}) => {

    const [myQuestion, setQuestion] = useState<IQuestion>(initialQuestionValue);

    const questionTextChanged = (elem: ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = elem.target;
        const copyOfMyQuestion = {...myQuestion}; 
        copyOfMyQuestion.text = textarea.value;

        resizeTextArea(textarea);
        setQuestion(copyOfMyQuestion);
        onQuestionUpdated(copyOfMyQuestion);
    }

    const multipleChoiceChanged = (isMultipleChoice: boolean) => {
        const copyOfMyQuestion = { ...myQuestion, isMultipleChoice };
        
        if(isMultipleChoice && copyOfMyQuestion.multipleChoiceOptions.length === 0){
            const newKey = Math.random();
            copyOfMyQuestion.multipleChoiceOptions.push({key: newKey, text: '', id: newKey, removed: false});
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
        copyOfMyQuestion.multipleChoiceOptions.push({key: newKey, text: '', id: newKey, removed: false});
        
        setQuestion(copyOfMyQuestion);
    }

    const removeAnswer = (answerId: number) => {
        const copyOfMyQuestion = {...myQuestion};
        const indexOfAnswer = copyOfMyQuestion.multipleChoiceOptions.findIndex(a => a.id === answerId);
        copyOfMyQuestion.multipleChoiceOptions.splice(indexOfAnswer,1);
        
        setQuestion(copyOfMyQuestion);  
        onQuestionUpdated(copyOfMyQuestion); 
    }

    const onAnswerUpdated = (answer: IMultipleChoiceOption, index: number) => {
        const copyOfNewQuestion = {...myQuestion};        
        copyOfNewQuestion.multipleChoiceOptions[index] = answer;

        setQuestion(copyOfNewQuestion);
        onQuestionUpdated(copyOfNewQuestion);        
    }

    const resizeTextArea = (textarea: HTMLTextAreaElement) => {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
    };

    useEffect(() => {
        const textarea = document.getElementById(`q${questionNumber}`) as HTMLTextAreaElement;
        if (textarea) { resizeTextArea(textarea); }
    }, [questionNumber]);

    return (
        <div >
            <br/>
            <div className="question-builder">
                <div className="row my-3 justify-content-center">    
                    <div className="col col-sm-11">
                    <textarea
                        placeholder="Enter question" 
                        className="text-center question-text-textarea" 
                        id={'q' + questionNumber} 
                        onChange={questionTextChanged} 
                        value={myQuestion.text}
                        key={'q' + questionNumber}    
                        rows={1}                    
                    />      
                    </div>
                </div>                
                <div className="row mt-3 justify-content-center">
                    <div className="col col-sm-11 col-md-9 col-xxl-7">
                        <div className="btn-group w-100" role="group">
                            <button
                                type="button"
                                className={`btn ${!myQuestion.isMultipleChoice ? "custom-blue-btn blue-btn-selected" : "outline-custom-blue-btn tr-not-selected"} btn-sm`}
                                onClick={() => multipleChoiceChanged(false)}
                                > Text Response
                            </button>
                            <button
                                type="button"
                                className={`btn ${myQuestion.isMultipleChoice ? "custom-blue-btn blue-btn-selected" : "outline-custom-blue-btn"} btn-sm`}
                                onClick={() => multipleChoiceChanged(true)}
                                >Multiple Choice
                            </button>
                        </div>
                    </div>
                </div>                

                { myQuestion.isMultipleChoice && (
                    <div id="multipleChoiceDiv" className="card">
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
                        <div className="row justify-content-center mb-2">
                            <div className="col">
                                <button
                                     className="btn custom-green-btn btn-sm my-2 bi bi-plus-lg"
                                    style={{display: myQuestion.multipleChoiceOptions.length >= 26 ? "none" : "inline-block"}}
                                    onClick={() => addAnswer()}
                                >                                 
                                </button>
                            </div>                            
                        </div>
                        <div className="row text-center mt-4">
                            <div className="col">
                                <span className="text-dark-blue">Let user pick...</span>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col col-sm-11 col-md-9 col-xxl-7">
                                <div className="btn-group mt-3 w-100" role="group">
                                    <button
                                        type="button"
                                        className={`btn ${!myQuestion.multipleAnswersPermitted ? "custom-blue-btn blue-btn-selected" : "outline-custom-blue-btn"} btn-sm w-50`}
                                        onClick={() => multAnsPermittedChanged(false)}
                                        >Only one
                                    </button>
                                    <button
                                        type="button"
                                        className={`btn ${myQuestion.multipleAnswersPermitted ? "custom-blue-btn blue-btn-selected" : "outline-custom-blue-btn"} btn-sm w-50`}
                                        onClick={() => multAnsPermittedChanged(true)}
                                        >Many
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="row mt-4 pt-4 justify-content-center">
                    <div className="col-6">
                        <Button variant="danger" className="btn btn-sm btn-danger w-75" onClick={() => onRemoveQuestionClicked(questionNumber)}> <i className="bi bi-trash"></i></Button>  
                    </div>
                </div>         
            </div>            
        </div>
    )
}

export default QuestionBuilder;