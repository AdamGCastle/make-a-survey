import { useState, FunctionComponent, useEffect, useRef } from "react";
import QuestionBuilder from "./QuestionBuilder";
import { ChangeEvent } from "react";
import { IQuestion, ISurvey } from "./models";
import { useNavigate } from "react-router-dom";
import '../App.css';
import React from 'react';
import { useDialogue } from '../features/DialogueContext';

interface SurveyBuilderProps{       
    initialSurveyValue: ISurvey;
}

const SurveyBuilder: FunctionComponent<SurveyBuilderProps> = ({initialSurveyValue}) => {
    const originalVersionRef = useRef(structuredClone(initialSurveyValue));
    const [survey, setSurvey] = useState<ISurvey>(initialSurveyValue);    
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { showDialogue } = useDialogue();
    const [deleteSuccess, setDeleteSuccess] = useState<boolean | undefined>(undefined);
    const [deleteError, setDeleteError] = useState<string>('');
    const baseUrl = process.env.REACT_APP_PORTFOLIO_WEB_API_BASE_URL;    
    const token = localStorage.getItem("jwtToken");

    const surveyNameChanged = (elem: ChangeEvent<HTMLTextAreaElement>) => {     
        const textarea = elem.target;
        textarea.style.height = "auto"; 
        textarea.style.height = `${textarea.scrollHeight}px`;
        
        const value = elem.target.value;
        const copyOfSurvey = {...survey};
        copyOfSurvey.name = value;
        setSurvey(copyOfSurvey);
    }

    const addQuestion = () => {
        const copyOfSurvey = {...survey};
        const newKey = Math.random();
        copyOfSurvey.questions.push({
            key: newKey, 
            id: newKey, 
            text: '', 
            multipleChoiceOptions: [], 
            isMultipleChoice: false, 
            multipleAnswersPermitted: false, 
            removed: false});
            
        setSurvey(copyOfSurvey);
    }

    const onRemoveQuestionClicked = (questionNum: number) => {

        const question : IQuestion = survey.questions[questionNum];        
        const confirmWithUser: boolean = question.text.trim() !== '' || question.multipleChoiceOptions.some(x => x.text.trim() !== '');

        if(confirmWithUser){
            showDialogue({
                title: 'Delete question',
                message: 'Are you sure want to delete this question?',
                isQuestion: true,
                onOkNavigationRoute: '',
                onConfirm: () => {
                    removeQuestion(questionNum, question.id)
                }
            });
            
            return;            
        }       
        
        removeQuestion(questionNum, question.id);
    }

    const removeQuestion = (questionNum: number, id: number) => {
        const indexOfQuestion = questionNum;
        const copyOfSurvey = {...survey};
        copyOfSurvey.questions.splice(indexOfQuestion,1);   
        copyOfSurvey.changesMade = true;
        
        setSurvey(copyOfSurvey);

        if(id > 0) {
            const question = originalVersionRef.current.questions.find(x => x.id === id);

            if (question !== undefined){
                question.removed = true;
            }
        }
    }
    
    const onQuestionUpdated = (question: IQuestion, index: number) => {        
        const copyOfSurvey = {...survey};        
        copyOfSurvey.questions[index] = question;
        copyOfSurvey.changesMade = true;
        
        setSurvey(copyOfSurvey);

        if(question.id > 0) {
            const originalVersionOfQuestion = originalVersionRef.current.questions.find(x => x.id === question.id);
            if(originalVersionOfQuestion === undefined) {
                return;
            }

            const removedMCOs = originalVersionOfQuestion.multipleChoiceOptions.filter(x => !question.multipleChoiceOptions.some(y => y.id === x.id))

            for(const removedMCO of removedMCOs){
                removedMCO.removed = true;
            }
        }    
    }
 
    const submitSurvey = async () => {
        setIsLoading(true);
        const surveyDto = structuredClone(survey);

        for (const question of surveyDto.questions){
            if(question.id < 1) {
                question.id = 0;                
            }

            for(const multipleChoiceOption of question.multipleChoiceOptions) {
                if(multipleChoiceOption.id < 1) {
                    multipleChoiceOption.id = 0;
                }
            }            
        }
        
        for (const question of originalVersionRef.current.questions) {
            if (question.removed) {
                surveyDto.questions.push(question);
                continue;
            }
        
            for(const multipleChoiceOption of question.multipleChoiceOptions.filter(x => x.removed)) {
                const surveyDtoQuestion = surveyDto.questions.find(x => x.id === question.id);

                if(surveyDtoQuestion !== undefined) {
                    surveyDtoQuestion.multipleChoiceOptions.push(multipleChoiceOption);
                }
            }
        }

        let errorMessage = 'Failed to save survey';

        const controllerAction = survey.id === 0 ? 'Create' : 'Update';
        const requestMethod  = survey.id === 0 ? 'POST' : 'PUT';

        try{
            const response = await fetch(`${baseUrl}/Surveys/${controllerAction}`, { 
                method: requestMethod,
                body: JSON.stringify(surveyDto),            
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });      

            if(!response.ok) {
                setIsLoading(false);
                let responseText = await response.text();
                
                if(responseText !== null && responseText !== ''){
                    errorMessage = responseText;
                }

                showDialogue({
                    title: 'Error',
                    message: errorMessage,
                    isQuestion: false,
                    onOkNavigationRoute: ''
                });

                return;
            }

            showDialogue({
                title: 'Success',
                message: `Survey ${controllerAction.toLocaleLowerCase()}d!`,
                isQuestion: false,
                onOkNavigationRoute: '/'
            });

            survey.changesMade = false;
        } catch(error: any) {
            if(error.message !== null && error.message !== ''){
                errorMessage = error.message
            }
            
            showDialogue({
                title: 'Error',
                message: errorMessage,
                isQuestion: false,
                onOkNavigationRoute: ''
            });            
        } finally{
            setIsLoading(false);
        }
    }

    const onBackClicked = () => {
        if(!survey.changesMade){
            navigate('/', { replace: true});

            return;
        }

        showDialogue({
            title: 'Exit survey',
            message: 'Are you sure you want to exit this survey? Unsaved changes will be lost.',
            isQuestion: true,
            onOkNavigationRoute: '',
            onConfirm: () => {
                navigate('/');
            }
        });
    }

    const onDeleteClicked = async () => {
        showDialogue({
            title: 'Delete survey?',
            message: `Are you sure you want to delete "${survey.name}"? This change cannot be undone.`,
            isQuestion: true,
            onOkNavigationRoute: '',
            onConfirm: async () => {
                try {
                    const response = await fetch(`${baseUrl}/Surveys/Delete?id=${survey.id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    
                    if (!response.ok) {
                        const errorMessage = await response.text();
                        setDeleteError(errorMessage);
                        setDeleteSuccess(false);

                        return;
                    }
                    
                    setDeleteSuccess(true);

                } catch (error: any) {
                    setDeleteError(error.message);
                    setDeleteSuccess(false);
                } finally{
                    setIsLoading(false)
                }
            }            
        });
    };    

    const publishStatusChanged = (published: boolean) => {
        const copyOfSurvey = {...survey, published};
        setSurvey(copyOfSurvey);
    }

    const resizeTextArea = (textarea: HTMLTextAreaElement) => {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
    };

    useEffect(() => {
        const surveyNameTextArea = document.getElementById(`survey${survey.id}Name`) as HTMLTextAreaElement;
        resizeTextArea(surveyNameTextArea);

        if(typeof deleteSuccess === 'undefined') {
            return;
        }

        setDeleteSuccess(undefined);

        showDialogue({
            title: deleteSuccess ? 'Success!' : 'Error',
            message: deleteSuccess ? 'Survey deleted.': `Failed to delete survey. ${deleteError}`,
            isQuestion: false,
            onOkNavigationRoute: deleteSuccess ? '/' : ''
        });       
    }, [deleteSuccess, deleteError, navigate, showDialogue, survey.id]);

    return (        
        <div>
            <div className="survey-builder row text-center justify-content-center m-2">
                <div className="col col-xl-10">
                    <div className="row justify-content-center mt-3">
                        <div className="col col-11 col-sm-10 col-md-9 col-lg-8"> 
                            <textarea 
                                id={`survey${survey.id}Name`}
                                placeholder="Enter the name of your survey" 
                                className="survey-title-textarea text-center text-dark-blue" 
                                onChange={surveyNameChanged} 
                                value={survey.name}
                                rows={1}
                            />
                        </div>
                    </div>
                    {
                        survey.questions.map((q, index) => (
                            <QuestionBuilder
                                key={q.key}
                                questionNumber={index+1}
                                onQuestionUpdated={(question: IQuestion) => onQuestionUpdated(question, index)}
                                onRemoveQuestionClicked={() => onRemoveQuestionClicked(index)}
                                initialQuestionValue={q}
                            />
                        ))
                    }
                    <div className="alignCentre">                     
                        <button className="btn btn-sm custom-green-btn add-question-btn text-center mt-3" onClick={() => addQuestion()}>Add Question</button>                    
                    </div>
                    <div className="question-builder mt-4">
                        <div className="row justify-content-center">
                            <div className="col">
                                <span className="text-dark-blue fw-bold">Is this survey ready for users to take?</span>
                            </div>
                        </div>
                        <div className="row justify-content-center mt-3">
                            <div className="col">
                            <div className="btn-group mt-3 w-50" role="group">
                                    <button
                                        type="button"
                                        className={`btn ${survey.published ? "custom-blue-btn blue-btn-selected" : "outline-custom-blue-btn"} btn-sm w-50`}
                                        onClick={() => publishStatusChanged(true)}
                                        >Yes
                                    </button>
                                    <button
                                        type="button"
                                        className={`btn ${!survey.published ? "custom-blue-btn blue-btn-selected" : "outline-custom-blue-btn"} btn-sm w-50`}
                                        onClick={() => publishStatusChanged(false)}
                                        >No
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div className="alignCentre mb-2">
                        <button 
                            className="btn custom-dark-blue-btn btn-sm mx-3 save-delete-survey-btn" 
                            onClick={() => submitSurvey()}
                            disabled={isLoading}>Save Survey
                        </button>
                        {survey.id > 0 && 
                            <button 
                                className="btn btn-danger btn-sm mx-3 save-delete-survey-btn" 
                                onClick={() => onDeleteClicked()}
                                disabled={isLoading}>Delete Survey                                
                            </button>
                        }
                    </div>
                    {isLoading && <div className="spinner-border text-primary mt-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>} 
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <button 
                    onClick={onBackClicked} 
                    className='btn btn-light btn-sm my-3 w-25'
                    disabled={isLoading}>Back
                </button>  
            </div>
        </div>        
    )
}

export default SurveyBuilder;