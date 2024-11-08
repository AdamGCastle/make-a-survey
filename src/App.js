import './App.css';
import { Routes, Route, Outlet} from "react-router-dom";
import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
//import Home from '@components/home';
import Home from './home/Home';

import CreateSurvey from './create-survey/CreateSurvey';
import EditSurvey from './edit-survey/EditSurvey';
import NotFound from './home/NotFound';
import EditSelect from './home/EditSelect';

// import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';

export default function App() {
  return (   
    
          <Routes>
            <Route path="/" element={<Layout/>}>
              <Route index element={<Home/>}/>
              <Route path="/createsurvey/" element={CreateSurvey()} />
              <Route path="/editsurvey/:id" element={<EditSurvey />}/>
              <Route path="/editsurveys" element={<EditSelect />}/>
              <Route path="*" element = {NotFound()} />
            </Route>
          </Routes>    
          
  );
}

function Layout() {
  return (
    <div className='main'>
      <Navbar bg="light" className='justify-content-center'>
        <Navbar.Brand>
          {/* <Nav.Link href="https://adamcastleprojects.azurewebsites.net/">Adam Castle CV</Nav.Link> */}
        </Navbar.Brand>    
        <Nav>
          <NavDropdown title="Projects">
            <NavDropdown.Item href="https://adamcastleprojects.azurewebsites.net/">All projects</NavDropdown.Item>
            <NavDropdown.Item href="https://takeasurvey.azurewebsites.net/">TakeASurvey</NavDropdown.Item>
            <NavDropdown.Item href="https://castlelibrary.azurewebsites.net/">CastleLibrary</NavDropdown.Item>
            <NavDropdown.Item href="https://teacheradmin.azurewebsites.net/">TeacherAdmin</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link href="/">Home</Nav.Link>
          {/* <Nav.Link href="/createsurvey">New survey</Nav.Link>   */}
        </Nav>
      </Navbar>      
      <main className='main'>  
      <div className="card"> 
        <Outlet/> 
        </div>
      </main>          
    </div>
  )
}