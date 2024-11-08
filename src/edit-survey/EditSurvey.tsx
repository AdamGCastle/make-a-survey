import SurveyBuilder from "../create-survey/SurveyBuilder";
import { ISurvey } from "../create-survey/models";
import { FunctionComponent, useState, useCallback, useEffect } from "react";
import { Link, useNavigate, useParams} from "react-router-dom";
import NotFound from "../home/NotFound";
import React from 'react';

const EditSurvey: FunctionComponent = () => {

    const { id } = useParams();
    const [surveyToEdit, setSurveyToEdit] = useState<ISurvey>()
    const [isLoading, setIsLoading] = useState(false);  
    const [error, setError] = useState(null);
    const baseUrl = process.env.REACT_APP_PORTFOLIO_WEB_API_BASE_URL;

    const getSurvey = useCallback(async () => {        

        if(id === null) {
            return < NotFound/>
        }
        try{
            setIsLoading(true);
            const response = await fetch(`${baseUrl}/Surveys/ReadById?id=${id}`);
            console.log('response: ', response);
            if(!response.ok) {
                throw new Error("Couldn't connect to the database.")
            }

            const data = await response.json();

            const survey: ISurvey = { 
                name: data.name, 
                id: data.id,
                key: data.id,
                questions: data.questions,
                changesMade: false              
            };

            for (const question of survey.questions) {
                question.key = question.id;

                for (const option of question.multipleChoiceOptions) {
                    option.key = option.id;
                }
            }

            setSurveyToEdit(survey)
            setIsLoading(false);
            setError(null);
  
        } catch(error: any) {
            console.log('catch error: ', error);
            setError(error.message);
        }

        setIsLoading(false);              
    }, [id, baseUrl]);

    useEffect(() => {
        getSurvey()
    }, [getSurvey]);
    
    return (
        <div>
            <h2>{surveyToEdit?.name}</h2>
            <br></br>
            {isLoading && <p>Loading...</p>}
            {surveyToEdit != null && <SurveyBuilder initialSurveyValue={surveyToEdit}/>}
            {!isLoading && error &&
                <div>
                <p>{'Something went wrong trying to get the survey you wanted to edit.'}</p>
                    <Link to='/'>
                    <button className='btn btn-secondary btn-sm me-3'>Back</button>
                    </Link>
                </div>
            }
        </div>
    )
}
export default EditSurvey;