import { HashRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
// import AppRoutes from "./AppRoutes";
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from "react-redux";
import store from "./store";
import { persistor } from "./store";
// import { reportWebVitals } from './reportWebVitals';
import ContactPage from "./pages/Contact";
import SchoolList from "./pages/SchoolsList";
import CourseList from "./pages/CourseList";
import FooterComp from "./components/Footer";
import FAQ from "./pages/FAQ";
import HomePage from "./pages/Home";
import CoursePage from "./pages/CourseDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyCourses from "./pages/MyCourses";
import PrivateRoute from "./assets/PrivateRoute";
// React router used to define routes

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}></PersistGate>
        <div className="App">
            <HashRouter>
              <Navbar/>
              <Routes>
                  <Route path="/Contact" element={<ContactPage/>}/> 
                  <Route path="/" element={<HomePage/>}/> 
                  <Route path="/Schools" element={<SchoolList/>}/> 
                  <Route path="/FAQ" element={<FAQ/>}/> 
                  <Route path="/Schools/:id" element={<CourseList/>}/> 
                  <Route path="/Course" element={<CoursePage/>}/>
                  <Route path="/SignIn" element={<Login/>}/>
                  <Route path="/Signup" element={<Signup/>}/>
                  <Route path="/MyCourses" element={<PrivateRoute><MyCourses/></PrivateRoute>}/>
              </Routes>
              <FooterComp />
            </HashRouter>
        </div>  
    </Provider>
  );
}

export default App;
