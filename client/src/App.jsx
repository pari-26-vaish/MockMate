import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import InterviewsPage from "./pages/InterviewsPage";
import ProgressPage from "./pages/ProgressPage";
import CreateInterviewPage from "./pages/CreateInterviewPage";
import AuthPage from "./pages/AuthPage";
import InterviewRoomPage from "./pages/InterviewRoomPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/interviews" element={<InterviewsPage />} />

        <Route path="/progress" element={<ProgressPage />} />

        <Route path="/create-interview" element={<CreateInterviewPage />} />

        <Route path="/login" element={<AuthPage />} />

        <Route path="/interview-room" element={<InterviewRoomPage />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;