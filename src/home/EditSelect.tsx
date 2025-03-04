import { useState, useEffect, useCallback, FunctionComponent } from "react";
import {Link } from 'react-router-dom';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Container} from "react-bootstrap";
import { IQuestion, ISurvey } from "../create-survey/models";
import React from 'react';


const EditSelect: FunctionComponent = () => {

    const [surveys, setSurveys] = useState<ISurvey[]>([{name: '', id: 0, questions: [], key: 0, changesMade: false }])
    const [isLoading, setIsLoading] = useState(false);
    const [fiveSecondsPassed, setFiveSecondsPassed] = useState(true);
    const [fifteenSecondsPassed, setFifteenSecondsPassed] = useState(false);
    // const [showDbReactivationMessage, setShowDbReactivationMessage] = useState(false);  
    // const [showDbReactivationMessage2, setShowDbReactivationMessage2] = useState(false);  
    const [error, setError] = useState('');
    const baseUrl = process.env.REACT_APP_PORTFOLIO_WEB_API_BASE_URL;

    const getSurveys = useCallback(async () => {
        try{
            setIsLoading(true);

            const response = await fetch(`${baseUrl}/Surveys/ReadAll`, {
                method: 'GET'
            });

            if(!response.ok) {     
                console.log(response);           
                let errorMessage = 'Could not connect to the database.';
                const contentType = response.headers.get('content-type');
                
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                }
                
                setError(errorMessage);
                setIsLoading(false);

                return;
            }

            const data = await response.json();
            
            const surveys: ISurvey[] = data.map(
                (item: { name: string; id: number; questions: IQuestion[] }) => ({
                    name: item.name,
                    id: item.id,
                    questions: item.questions,
                    key: item.id
                })
            );
            
            setSurveys(surveys);
            setIsLoading(false);
            setError('');
        } catch(error: any) {
                setError(error.message);
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
                <h4 className="p-3">Edit an existing survey</h4>  
                <div className="m-3">
                    {!isLoading && surveys.length > 0 && surveys[0].id !== 0 && surveys.map(s => 
                        <div key={s.key}>
                            <Container>
                                <div className="row justify-content-center">
                                    <div className="col col-10 col-xl-8">
                                        <Link to={`/editsurvey/${s.id}`}>
                                            <button className="btn custom-blue-btn w-100">{s.name}</button>
                                        </Link>
                                    </div>
                                </div>
                            </Container>                        
                            <br/>                        
                        </div>
                    )}
                    
                    {!isLoading && surveys.length === 0 && <p>There aren't any surveys yet.</p>}
                    {isLoading && <p>Loading...</p>}
                    {isLoading && fiveSecondsPassed && <p className="text-secondary">Database in sleep mode. Please allow up to 60 seconds to reactivate...</p>}
                    {/* <p className="text-secondary">Database in sleep mode. Please allow up to 60 seconds to reactivate...</p> */}
                    {isLoading && fifteenSecondsPassed && <p className="text-secondary">Thank you for your patience. Database hosting is very expensive, and we implement a sleep mode when not in use to keep costs within this project's budget.</p>}
                    {!isLoading && error.trim() !== '' && <p>{`Something went wrong trying to get a list of surveys. Please refresh the page.${error}`}</p>}
                </div>            
            </div>
        </div>            
    </div>        
    )
}

export default EditSelect;