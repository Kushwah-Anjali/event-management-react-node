import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Users from "./pages/Users";
import UserEvents from "./pages/UserEvents";
import RegisterDetails from "./pages/RegisterDetails";
import EventHistory from "./pages/EventHistory";
import HistoryPageAdmin from "./pages/HistoryPageAdmin";
import './App.css';
import RegisterAdminView from "./pages/RegisterAdminView";
import 'leaflet/dist/leaflet.css';
import MapPage from "./pages/Mappage";


function App() {

  useEffect(() => {
    AOS.init({
      duration: 1500,
      easing: "ease-out-cubic",
      once: true,
    });
  }, []);
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/users" element={<Users />} />
        <Route path="/userevents" element={<UserEvents />} />
          <Route path="/register-details" element={<RegisterDetails />} />
    <Route path="/event-history" element ={<EventHistory />}/>
  <Route path="/history" element={<HistoryPageAdmin />} />
<Route path="/RegisterAdminView" element={<RegisterAdminView />} />

<Route path="/map" element={<MapPage />} />

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
