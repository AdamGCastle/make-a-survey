import { useNavigate } from "react-router-dom";
import EditSelect from './EditSelect';

const Home = () => {  
  const navigate = useNavigate();

  const makeANewSurveyClicked = () => {
    navigate(`/createsurvey`);
  };

  return (
      <div className="alignCentre">
        <div className="row justify-content-center">
          <div className="col col-sm-8 col-md-6 mx-2">
            <div className="card title-card mb-3 p-3 w-100">
              <h1>Make a survey</h1>
            </div>
              <button className="btn btn-md custom-green-btn mb-3 px-5" onClick={makeANewSurveyClicked}>
                Create New
              </button>
          </div>
        </div>
        {/* <div className="row justify-content-center">
          <div className="col col-sm-8 col-md-6"> */}
            <EditSelect />
            {/* </div>
        </div> */}
        <div className="row justify-content-center">
          <div className="col col-sm-8 col-md-6 mx-2">
            <div className="card title-card mb-3 p-2 w-100">
              <h4 className="p-3 fw-normal">
                <a href="https://takeasurvey.acprojects.ip-ddns.com/" target="_blank" rel="noopener noreferrer">
                  Take an existing survey
                </a>
              </h4>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Home;