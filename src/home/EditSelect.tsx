import { useState, useEffect, useCallback, FunctionComponent } from "react";
import {Link } from 'react-router-dom';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Container, Row } from "react-bootstrap";
import { IQuestion, ISurvey } from "../create-survey/models";
import React from 'react';


const EditSelect: FunctionComponent = () => {

    const [surveys, setSurveys] = useState<ISurvey[]>([{name: '', id: 0, questions: [], key: 0, changesMade: false }])
    const [isLoading, setIsLoading] = useState(false);  
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
        getSurveys()
    }, [getSurveys]);

    return (
        <div>
            <h4>Edit an existing survey</h4> 
            <br/> 
            <div>
                {!isLoading && surveys.length > 0 && surveys[0].id !== 0 && surveys.map(s => 
                    <div key={s.key}>
                        <Container>
                            <Row>
                                <Col>
                                </Col>
                                <Col>
                                {s.name}
                                </Col>
                                <Col>
                                    <Link to={`/editsurvey/${s.id}`}>
                                        <Button variant="secondary">Edit</Button>
                                    </Link>
                                </Col>
                                <Col>
                                </Col>
                            </Row>
                        </Container>                        
                        <br/>                        
                    </div>
                )}
                
                {!isLoading && surveys.length === 0 && <p>There aren't any surveys yet.</p>}
                {isLoading && <p>Loading...</p>}
                {!isLoading && error.trim() !== '' && <p>{`Something went wrong trying to get a list of surveys. ${error}`}</p>}
            </div>
        </div>
    )
}

export default EditSelect;