import { useState, useEffect, useCallback, FunctionComponent } from "react";
import {Link } from 'react-router-dom';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Container} from "react-bootstrap";
import { IQuestion, ISurvey } from "./models";
import React from 'react';


const EditSelect: FunctionComponent = () => {

    const [surveys, setSurveys] = useState<ISurvey[]>([{name: '', id: 0, questions: [], key: 0, changesMade: false, createdByAccountId: 0, published: false }])
    const [isLoading, setIsLoading] = useState(false);
    const [fiveSecondsPassed, setFiveSecondsPassed] = useState(true);
    const [fifteenSecondsPassed, setFifteenSecondsPassed] = useState(false);
    const [error, setError] = useState('');
    const baseUrl = process.env.REACT_APP_PORTFOLIO_WEB_API_BASE_URL;

    const getSurveys = useCallback(async () => {
        let message = 'Something went wrong trying to get a list of surveys. Please refresh the page.';
        try{
            setIsLoading(true);
            const token = localStorage.getItem("jwtToken");
            const response = await fetch(`${baseUrl}/Surveys/ReadAll?forEdit=true`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if(!response.ok) {                 
                const errorData = await response.text();
                
                if(errorData !== ''){
                    setError(`${message} ${errorData}`);                
                }

                setIsLoading(false);

                return;
            }

            const data = await response.json();
            
            const surveys: ISurvey[] = data.map(
                (item: { 
                    name: string; 
                    id: number; 
                    questions: IQuestion[];
                    createdByAccountId: number
                 }) => ({
                        name: item.name,
                        id: item.id,
                        questions: item.questions,
                        key: item.id,
                        createdByAccountId: item.createdByAccountId?? 0
                    })
            );
            
            setSurveys(surveys);
            setIsLoading(false);
            setError('');
        } catch(error: any) {
            console.log(error.message);
            setError(message);
            setIsLoading(false);
        }
    }, [baseUrl]);

    useEffect(() => {
        let timeoutId5: NodeJS.Timeout;
        let timeoutId15: NodeJS.Timeout;
    
        if (isLoading) {
            timeoutId5 = setTimeout(() => {
                if (isLoading) {
                    setFiveSecondsPassed(true);
                }
            }, 5000);
    
            timeoutId15 = setTimeout(() => {
                if (isLoading) {
                    setFifteenSecondsPassed(true);
                }
            }, 15000);
        } else {            
            setFiveSecondsPassed(false);
            setFifteenSecondsPassed(false);
        }
    
        return () => {
            clearTimeout(timeoutId5);
            clearTimeout(timeoutId15);
        };
    }, [isLoading]);

    useEffect(() => {
        getSurveys()

    }, [getSurveys]);   

    return (
        <div className="row justify-content-center">
          <div className="col col-sm-8 col-md-6 mx-2">
            <div className="card title-card mb-3 mx-3 w-100">
                <h4 className="p-3">Surveys to edit</h4>
                <div className="m-2">
                    {!isLoading && surveys.length > 0 && surveys[0].id !== 0 &&
                        <div>
                            {surveys.filter(x => x.createdByAccountId === 0).map(s => 
                                <div key={s.key}>
                                    <Container>
                                        <div className="row justify-content-center">
                                            <div className="col col-10 col-xl-8">
                                                <Link to={`/editsurvey/${s.id}?name=${encodeURIComponent(s.name)}`}>
                                                    <button className="btn custom-blue-btn w-100">{s.name}</button>
                                                </Link>
                                            </div>
                                        </div>
                                    </Container>                        
                                    <br/>                        
                                </div>
                            )}    
                            {surveys.some(x => x.createdByAccountId > 0) &&   
                            <div>                     
                                <h6 className="p-3">My Surveys</h6>
                                {surveys.filter(x => x.createdByAccountId > 0).map(s => 
                                    <div key={s.key}>
                                        <Container>
                                            <div className="row justify-content-center">
                                                <div className="col col-10 col-xl-8">
                                                    <Link to={`/editsurvey/${s.id}?name=${encodeURIComponent(s.name)}`}>
                                                        <button className="btn custom-blue-btn w-100">{s.name}</button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </Container>                        
                                        <br/>                        
                                    </div>
                                )} 
                            </div>
                        }
                        </div>
                    }
                    
                    {!isLoading && surveys.length === 0 && <p>There aren't any surveys yet.</p>}
                    {isLoading && 
                        <div className="spinner-border text-primary mb-3" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    }
                    {isLoading && fiveSecondsPassed && <p className="text-secondary">Database in sleep mode. Please allow up to 60 seconds to reactivate...</p>}
                    {isLoading && fifteenSecondsPassed && <p className="text-secondary">Thank you for your patience. Database hosting is very expensive, and we implement a sleep mode when not in use to keep costs within this project's budget.</p>}
                    {!isLoading && error.trim() !== '' && <p>{`${error}`}</p>}
                </div>            
            </div>
        </div>            
    </div>        
    )
}

export default EditSelect;