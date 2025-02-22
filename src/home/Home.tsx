import { useNavigate } from "react-router-dom";
import EditSelect from './EditSelect';

const Home = () => {  
  const navigate = useNavigate();

  const makeANewSurveyClicked = () => {
    navigate(`/createsurvey`);
  };

  return (
      <div className="alignCentre">
        <div className="row">
          <div className="col">
            <div className="card title-card mb-3 p-3">
              <h1 className="">Make a survey</h1>
            </div>
              <button className="btn btn-md btn-primary mb-3" onClick={makeANewSurveyClicked}>
                Create New
              </button>
          </div>
        </div>
        <EditSelect />  
      </div> 
  );
};

export default Home;