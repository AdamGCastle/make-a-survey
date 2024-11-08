import {Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import EditSelect from './EditSelect';
import { Button } from 'react-bootstrap';

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
        <Link to="https://white-sea-00426ad03.5.azurestaticapps.net/">
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