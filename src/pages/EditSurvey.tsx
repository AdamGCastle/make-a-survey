import SurveyBuilder from "../features/SurveyBuilder";
import { ISurvey } from "../features/models";
import { FunctionComponent, useState, useCallback, useEffect } from "react";
import { Link, useParams, useSearchParams} from "react-router-dom";
import NotFound from "./NotFound";

const EditSurvey: FunctionComponent = () => {

    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const surveyName = searchParams.get("name");
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
            if(!response.ok) {
                throw new Error("Couldn't connect to the database.")
            }

            const data = await response.json();

            const survey: ISurvey = { 
                name: data.name, 
                id: data.id,
                key: data.id,
                questions: data.questions,
                changesMade: false,
                createdByAccountId: data.createdByAccountId             
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
            <div className="row justify-content-center">
                <div className="col col-sm-8 col-md-6 mx-2">
                    <div className="card title-card mb-3 p-3 w-100 text-center">
                        <h2>Edit survey</h2>
                    </div>             
                </div>
            </div>
            
            <br/>
            {isLoading && 
                <div className="row justify-content-center">
                    <div className="col col-sm-8 col-md-6 d-flex justify-content-center mx-2">
                        <div className="card p-3 w-100 d-inline-block text-center">
                            <div className="row">
                                <div className="col">
                                 <p >Loading</p>
                                 <h3><strong>{surveyName}</strong></h3>
                                </div >
                            </div>
                            <div className="row">
                                <div className="col d-flex justify-content-center">
                                    <div className="spinner-border text-primary" role="status">                                
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            }
            {surveyToEdit !== null && surveyToEdit !== undefined && <SurveyBuilder initialSurveyValue={surveyToEdit}/>}
            {!isLoading && error &&
            <div className="row justify-content-center">
                <div className="col col-sm-8 col-md-6 mx-2">
                    <div className="card text-center p-3 w-auto d-inline-block">
                        <p>{'Something went wrong trying to get the survey you wanted to edit.'}</p>
                        <Link to='/'>
                        <button className='btn btn-secondary btn-sm me-3'>Back</button>
                        </Link>
                    </div>
                </div>
            </div>
            }
        </div>
    )
}
export default EditSurvey;