//import { useLocation } from "react-router-dom";
import { useLocation } from "react-router-dom";
import SurveyBuilder from "./SurveyBuilder";
import { ISurvey } from "./models";
import { FunctionComponent, useEffect, useState } from "react";
import React from 'react';

const CreateSurvey: FunctionComponent = () => {
    const location = useLocation();
    //const location = ''
    const [emptySurvey, setSurvey] = useState<ISurvey>({
        key: Math.random(),
        name : '', 
        id: 0,
        changesMade: false,
        questions: [{
            key: Math.random(), 
            id: Math.random(), 
            text: '', 
            multipleChoiceOptions: [], 
            isMultipleChoice: false, 
            multipleAnswersPermitted: false}] 
    });

    useEffect(() => {
        setSurvey({
          key: Math.random(),
          name: '',
          id: 0,
          changesMade: false,
          questions: [{
            key: Math.random(),
            id: Math.random(),
            text: '',
            multipleChoiceOptions: [],
            isMultipleChoice: false,
            multipleAnswersPermitted: false
          }]
        });
      }, [location]);
    
    return (
        <div>
            <div className="alignCentre">
                <h1 >Make a Survey</h1>
            </div>
            <br/>
            <SurveyBuilder initialSurveyValue={emptySurvey}/>
            <br/>
        </div>
    )
}
export default CreateSurvey;
