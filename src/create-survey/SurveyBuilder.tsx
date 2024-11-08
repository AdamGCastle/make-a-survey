import { useState, FunctionComponent, useEffect } from "react";
import QuestionBuilder from "./QuestionBuilder";
import { ChangeEvent } from "react";
import { IDialogueBox, IQuestion, ISurvey } from "./models";
import { useNavigate } from "react-router-dom";
import '../App.css';
//import 'bootstrap/dist/css/bootstrap.min.css';
import DialogueBox from "../edit-survey/DialogueBox";
import React from 'react';

interface SurveyBuilderProps{       
    initialSurveyValue: ISurvey;
}

const defaultDialogueBoxValue = {title: '', show: false, close: false, message: '', isQuestion: false, confirm: false, onOkNavigationRoute: ''};
// const initialSurveyValue = 
// {
//     key: newSurveyKey,
//     name : '', 
//     id: 0,
//     changesMade: false,
//     questions: [{
//         key: newQuestionKey, 
//         id: newQuestionKey, 
//         text: '', 
//         multipleChoiceOptions: [], 
//         isMultipleChoice: false, 
//         multipleAnswersPermitted: false}] 
// }


const SurveyBuilder: FunctionComponent<SurveyBuilderProps> = ({initialSurveyValue}) => {
    const [survey, setSurvey] = useState<ISurvey>(initialSurveyValue);    
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [yesDialogueAction, setYesDialogueAction] = useState(''); 
    const [dialogueBox, setDialogueBox] = useState<IDialogueBox>(defaultDialogueBoxValue);
    const baseUrl = process.env.REACT_APP_PORTFOLIO_WEB_API_BASE_URL;
    
    const surveyNameChanged = (elem: ChangeEvent<HTMLInputElement>) => {        
        const value = elem.target.value;
        const copyOfSurvey = {...survey};
        copyOfSurvey.name = value;
        setSurvey(copyOfSurvey);
    }

    const addQuestion = () => {
        const copyOfSurvey = {...survey};
        const newKey = Math.random();
        copyOfSurvey.questions.push({key: newKey, id: newKey, text: '', multipleChoiceOptions: [], isMultipleChoice: false, multipleAnswersPermitted: false});
        setSurvey(copyOfSurvey);
    }

    const removeQuestion = (questionNum: number) => {
        const indexOfQuestion = questionNum;
        const copyOfSurvey = {...survey};
        copyOfSurvey.questions.splice(indexOfQuestion,1);   
        
        setSurvey(copyOfSurvey);
    }
    
    const onQuestionUpdated = (question: IQuestion, index: number) => {        
        const copyOfSurvey = {...survey};        
        copyOfSurvey.questions[index] = question;
        copyOfSurvey.changesMade = true;
        
        setSurvey(copyOfSurvey); 
    }
 
    const submitSurvey = async () => {
            survey.questions.forEach(q => {
            q.id = q.id < 1 ? 0 : q.id;
            q.multipleChoiceOptions.forEach(a => {                
                a.id = a.id < 1 ? 0 : a.id;                              
            });            
        });

        if(survey.id === 0){   
            setIsLoading(true);  
            try{
                const response = await fetch(`${baseUrl}/Surveys/Create`, { 
                    method: 'POST',
                    body: JSON.stringify(survey),            
                    headers: {'Content-Type': 'application/json'}
                });
                
                if(!response.ok) {
                    setIsLoading(false);
                    let responseText = await response.text();
                    
                    if(responseText === null || responseText === ''){
                        responseText = 'Failed to save survey';
                    }

                    setupDialogueBox(true, 'Error', responseText, false);

                    return;
                }
                
                setIsLoading(false);
                setupDialogueBox(true, 'Success', 'Survey saved!', false);
                survey.changesMade = false;
            } catch(error: any) {
                setupDialogueBox(true, 'Error', error.message, false);
                setIsLoading(false);
                return;
            }

            setIsLoading(false);        
        } else {
            let errorMessage = 'Failed to save survey';

            try{
                const response = await fetch(`${baseUrl}/Surveys/Update`, { 
                    method: 'PUT',
                    body: JSON.stringify(survey),            
                    headers: {'Content-Type': 'application/json'}
                });      

                if(!response.ok) {
                    setIsLoading(false);
                    let responseText = await response.text();
                    
                    if(responseText !== null && responseText !== ''){
                        errorMessage = responseText;
                    }

                    setupDialogueBox(true, 'Error', errorMessage, false);
                    return;
                }

                setIsLoading(false);
                setupDialogueBox(true, 'Success', 'Survey updated!', false);
                survey.changesMade = false;
            } catch(error: any) {
                if(error.message !== null && error.message !== ''){
                    errorMessage = error.message
                }
                
                setupDialogueBox(true, 'Error', errorMessage, false);
                setIsLoading(false);
            }            
        }
    }

    const onYesClick = async () => {
        if(yesDialogueAction === 'deleteSurvey'){
            confirmDelete();

            return;
        } else if(yesDialogueAction === 'exitSurvey'){
            const newSurveyKey = Math.random();
            const newQuestionKey = Math.random();

            const copyOfSurvey = {...survey};
            copyOfSurvey.key = newSurveyKey;
            copyOfSurvey.name = '';
            copyOfSurvey.id = 0;
            copyOfSurvey.questions = [{
                        key: newQuestionKey, 
                        id: 0, 
                        text: '', 
                        multipleChoiceOptions: [], 
                        isMultipleChoice: false, 
                        multipleAnswersPermitted: false
                    }];           

            await setSurvey(copyOfSurvey);

            initialSurveyValue.key = newSurveyKey;
            initialSurveyValue.questions = [];
            initialSurveyValue.name = '';
            initialSurveyValue.id = 0;

            navigate('/');
        }
    }

    const confirmDelete = async () => {
        let errorMessage = 'Failed to delete survey.';

        try{
            const response = await fetch(`${baseUrl}/Surveys/Delete?id=${survey.id}`, {
                method: 'DELETE'
            })
            
            console.log('response: ', response);

            if(!response.ok) {
                let responseText = await response.text();
                
                if(responseText !== null && responseText !== ''){
                    errorMessage = responseText;
                }

                setupDialogueBox(true, 'Error', errorMessage, false);
                setIsLoading(false);
                return;
            } 

            setupDialogueBox(true, 'Success', 'Survey deleted.', false, '/');
        } catch(error: any) {
            if(error.message != null && error.message != ''){
                errorMessage = error.message
            }
            
            setupDialogueBox(true, 'Error', errorMessage, false);
            setIsLoading(false);   
        }
    }

    const closeDialogueBox = () => {
        const copyOfDialogueBox = {...dialogueBox};
        copyOfDialogueBox.isQuestion = false;
        copyOfDialogueBox.title = '';
        copyOfDialogueBox.message = '';
        copyOfDialogueBox.show = false;

        setDialogueBox(copyOfDialogueBox);
    }

    const setupDialogueBox = (show: boolean, title: string = '', message: string = '', isQuestion: boolean = false, onOkNavigationRoute: string = '') => {
        const copyOfDialogueBox = {...dialogueBox};

        copyOfDialogueBox.isQuestion = isQuestion;
        copyOfDialogueBox.title = title;
        copyOfDialogueBox.message = message;
        copyOfDialogueBox.show = show;
        copyOfDialogueBox.onOkNavigationRoute = onOkNavigationRoute;

        setDialogueBox(copyOfDialogueBox);
    }

    const onBackClicked = () => {
        if(!survey.changesMade){
            navigate('/', { replace: true});

            return;
        }

        setYesDialogueAction('exitSurvey');
        setupDialogueBox(true, 'Exit survey', 'Are you sure you want to exit this survey? Unsaved changes will be lost.', true);
    }

    const onDeleteClicked = () => {
        setYesDialogueAction('deleteSurvey');
        setupDialogueBox(true,'Delete Survey',`Are you sure you want to delete "${survey.name}"?`, true);
    }

    useEffect(() => {
        console.log('Survey has been updated to:', survey);
    }, [survey]);
    
    return (        
        <div>
            {!isLoading && <div>
                <div >
                    <div className="row">
                        <div className="col-2">         
                            <label className="me-2 fw-bold">Name:  </label>
                        </div>
                        <div className="col"> 
                            <input placeholder="Enter the name of your survey" className="text-input" type="text" onChange={surveyNameChanged} value={survey.name}></input>
                        </div>
                    </div>
                    <br/>
                    {
                        survey.questions.map((q, index) => (
                            <QuestionBuilder
                                key={q.key}
                                questionNumber={index+1}
                                onQuestionUpdated={(question: IQuestion) => onQuestionUpdated(question, index)}
                                removeQuestion={() => removeQuestion(index)}
                                initialQuestionValue={q}
                            />
                        ))
                    }
                    <br/>
                    <div className="alignCentre">                     
                    <button className="btn btn-sm btn-success addRemoveButton text-center" onClick={() => addQuestion()}>Add Question</button>                    
                    </div>
                    <br/>
                    <br/>             
                </div>  
                <div className="alignCentre">
                    <button className="btn btn-primary btn-sm me-3" onClick={() => submitSurvey()}>Save</button>
                    <button className="btn btn-danger btn-sm" onClick={() => onDeleteClicked()}>Delete Survey</button>
                    <DialogueBox
                        show={dialogueBox.show}
                        title={dialogueBox.title}
                        confirm={onYesClick}
                        close={closeDialogueBox}
                        message={dialogueBox.message}
                        isQuestion={dialogueBox.isQuestion}
                        onOkNavigationRoute={dialogueBox.onOkNavigationRoute}
                    />
                </div>
            </div>}
            {isLoading &&<div>
                <p>Loading...</p>
            </div>}
            <button onClick={onBackClicked} className='btn btn-secondary btn-sm me-3'>Back</button>      
        </div>        
    )
}

export default SurveyBuilder;