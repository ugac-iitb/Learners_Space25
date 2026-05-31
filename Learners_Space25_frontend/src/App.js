// App.js
import { HashRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ContactPage from "./pages/Contact";
import SchoolList from "./pages/SchoolsList";
import CourseList from "./pages/CourseList";
import FooterComp from "./components/Footer";
import FAQ from "./pages/FAQ";
import HomePage from "./pages/Home";
import CoursePage from "./pages/CourseDetail";
import Login from "./pages/Login";
import MyCourses from "./pages/MyCourses";
import PrivateRoute from "./assets/PrivateRoute";
import ScrollToTop from "./assets/ScrollToTop";
import TrackCourses from "./pages/TrackCourses";
import TrackCourseDetail from "./pages/TrackCourseDetail";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Navbar />
        <ScrollToTop />
        <Routes>
          <Route path="/Contact" element={<ContactPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/Schools" element={<SchoolList />} />
          <Route path="/FAQ" element={<FAQ />} />
          <Route path="/Schools/:id" element={<CourseList />} />
          <Route path="/Schools/TSS" element={<TrackCourses type="TSS" />} />
          <Route path="/Schools/NTSS" element={<TrackCourses type="NTSS" />} />
          <Route path="/TrackCourse" element={<TrackCourseDetail />} />
          <Route path="/Course" element={<CoursePage />} />
          <Route path="/SignIn" element={<Login />} />
          <Route path="/Signup" element={<Login initialMode="signup" />} />
          <Route path="/MyCourses" element={<PrivateRoute><MyCourses /></PrivateRoute>} />
        </Routes>
        <FooterComp />
      </HashRouter>
    </div>
  );
}

export default App;
