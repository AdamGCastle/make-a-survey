import { useLocation } from "react-router-dom";
import SurveyBuilder from "../features/SurveyBuilder";
import { ISurvey } from "@/features/models";
import { FunctionComponent, useEffect, useState } from "react";
import React from 'react';

const CreateSurvey: FunctionComponent = () => {
    const location = useLocation();
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
        multipleAnswersPermitted: false,
        removed: false
      }],
      createdByAccountId: 0
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
            multipleAnswersPermitted: false,
            removed: false
          }],
          createdByAccountId: 0
        });
      }, [location]);
    
    return (
        <div>
            <div className="card title-card alignCentre p-3">
                <h1 >Make a Survey</h1>
            </div>
            <br/>
            <SurveyBuilder initialSurveyValue={emptySurvey}/>
            <br/>
        </div>
    )
}
export default CreateSurvey;
