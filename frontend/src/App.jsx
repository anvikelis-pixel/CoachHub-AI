import "./App.css";
import { Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";

import Analytics from "./pages/Analytics";
import Calendar from "./pages/Calendar";
import Dashboard from "./pages/Dashboard";
import ExerciseLibrary from "./pages/ExerciseLibrary";
import ExerciseProfile from "./pages/ExerciseProfile";
import Injuries from "./pages/Injuries";
import Matches from "./pages/Matches";
import OpponentProfile from "./pages/OpponentProfile";
import Opponents from "./pages/Opponents";
import PlayerProfile from "./pages/PlayerProfile";
import Players from "./pages/Players";
import TrainingProfile from "./pages/TrainingProfile";
import Trainings from "./pages/Trainings";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/players"
          element={<Players />}
        />

        <Route
          path="/players/:playerId"
          element={<PlayerProfile />}
        />

        <Route
          path="/trainings"
          element={<Trainings />}
        />

        <Route
          path="/trainings/:trainingId"
          element={<TrainingProfile />}
        />

        <Route
          path="/exercises"
          element={<ExerciseLibrary />}
        />

        <Route
          path="/exercises/:exerciseId"
          element={<ExerciseProfile />}
        />

        <Route
          path="/opponents"
          element={<Opponents />}
        />

        <Route
          path="/opponents/:opponentId"
          element={<OpponentProfile />}
        />

        <Route
          path="/matches"
          element={<Matches />}
        />

        <Route
          path="/injuries"
          element={<Injuries />}
        />

        <Route
          path="/calendar"
          element={<Calendar />}
        />

        <Route
          path="/analytics"
          element={<Analytics />}
        />
      </Route>
    </Routes>
  );
}

export default App;