import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Players from "./pages/Players";
import Trainings from "./pages/Trainings";
import Matches from "./pages/Matches";
import Injuries from "./pages/Injuries";
import Calendar from "./pages/Calendar";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/players" element={<Players />} />
        <Route path="/trainings" element={<Trainings />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/injuries" element={<Injuries />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/analytics" element={<Analytics />} />
      </Route>
    </Routes>
  );
}

export default App;
