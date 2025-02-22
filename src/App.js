import './App.css';
import { Routes, Route, Outlet} from "react-router-dom";
import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
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
        <Nav>
          <Nav.Link href="/">Home</Nav.Link>
          {/* <Nav.Link href="/createsurvey">New survey</Nav.Link>   */}
        </Nav>
      </Navbar>      
      <main className='justify-content-center'>
        <div className="surrounding-card mt-3">
            <Outlet/> 
        </div>
      </main>          
    </div>
  )
}