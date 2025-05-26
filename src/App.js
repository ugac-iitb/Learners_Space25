import { BrowserRouter, HashRouter,Route,Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
// import AppRoutes from "./AppRoutes";
// import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from "react-redux";
// import store from "./store";
// import { persistor } from "./store";
// import { reportWebVitals } from './reportWebVitals';
import ContactPage from "./pages/Contact";
import SchoolList from "./pages/SchoolsList";
import CourseList from "./pages/CourseList";
import FooterComp from "./components/Footer";
import FAQ from "./pages/FAQ";

//React router used to define routes

function App() {
  return (
    // <Provider store={store}>
      // {/* Persistor */}
      // <PersistGate persistor={persistor} loading={null}></PersistGate>
        <div className="App">
            <BrowserRouter>
              <Navbar/>
              <Routes>
                  <Route path="/Contact" element={<ContactPage/>}/> 
                  <Route path="/Schools" element={<SchoolList/>}/> 
                  <Route path="/FAQ" element={<FAQ/>}/> 
                  <Route path="/Schools/:id" element={<CourseList/>}/> 
                  {/* <Route path="/login" element={<Login/>}/>
                  <Route path="/register" element={<Register/>}/>
                  <Route path="/profile" element={<Profile/>}/>
                  <Route path="/items" element={<Items/>}/>
                  <Route path="/upload_item" element={<CreateItem/>}/>
                  <Route path="/items/:id" element={<Item/>}/>
                  <Route path="/bids/:id" element={<Bidding/>}/>
                  <Route path="/notif" element={<Notify/>}/> */}
              </Routes>
              <FooterComp />
            </BrowserRouter>
        </div>  
    // </Provider>
  );
}

export default App;
