import {Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import EditSelect from './EditSelect';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import React from 'react';

const Home = () => {  
  const navigate = useNavigate();

  const makeANewSurveyClicked = () => {
    navigate(`/createsurvey`);
  };

  return (
    <div>
      <div className="alignCentre">    
        <h1>Welcome to MakeASurvey</h1>
        <br></br>
        <p>Surveys can be taken <a href="https://takeasurvey.azurewebsites.net/">here</a></p>   
        <br></br>
        <Link to="https://takeasurvey.azurewebsites.net/">
          <Button variant="primary" size="lg">Take an existing Survey</Button>
        </Link> 
        <br/>
        <br/>
        <button className="btn btn-lg btn-primary" onClick={makeANewSurveyClicked}>
          Make a New Survey
        </button>
        <br/>
        <br/>
        <EditSelect />  
      </div> 
    </div>   
  );
};

export default Home;