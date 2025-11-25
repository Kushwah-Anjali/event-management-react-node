import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Users from "./pages/Users";
import UserEvents from "./pages/UserEvents";
import RegisterDetails from "./pages/RegisterDetails";
import EventHistory from "./pages/EventHistory";
import HistoryPage from "./pages/HistoryPage";
import './App.css';
function App() {
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
  <Route path="/history" element={<HistoryPage />} />


      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
