import './App.css';
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home.tsx";
import CreateSurvey from "./pages/CreateSurvey";
import EditSurvey from "./pages/EditSurvey";
import NotFound from "./pages/NotFound";
import EditSelect from "./features/EditSelect";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import ManageAccountPage from '../src/pages/ManageAccountPage' ;
import { AuthProvider } from "./features/AuthContext";

export default function App() {

  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout setRefreshKey={setRefreshKey} />}>
          <Route index element={<Home key={refreshKey}/>} />
          <Route path="/createsurvey" element={<CreateSurvey />} />
          <Route path="/editsurvey/:id" element={<EditSurvey />} />
          <Route path="/editsurveys" element={<EditSelect/>} />
          <Route path="/manageaccount/:mode" element={<ManageAccountPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}