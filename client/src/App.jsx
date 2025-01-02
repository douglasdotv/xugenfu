import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminRoute from './components/AdminRoute';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import LeagueFetch from './pages/LeagueFetch';
import ActiveLeague from './pages/ActiveLeague';
import LeagueView from './pages/LeagueView';
import Predictions from './pages/Predictions';
import DetailedLeaderboard from './pages/DetailedLeaderboard';
import DetailedScores from './pages/DetailedScores';

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/leagues/fetch"
          element={
            <AdminRoute>
              <LeagueFetch />
            </AdminRoute>
          }
        />
        <Route path="/leagues/active" element={<ActiveLeague />} />
        <Route path="/leagues/:fsid" element={<LeagueView />} />
        <Route
          path="/leagues/:fsid/predictions"
          element={
            <PrivateRoute>
              <Predictions />
            </PrivateRoute>
          }
        />
        <Route
          path="/leagues/:fsid/scores"
          element={
            <PrivateRoute>
              <DetailedScores />
            </PrivateRoute>
          }
        />
        <Route
          path="/leagues/:fsid/leaderboard"
          element={<DetailedLeaderboard />}
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
};

export default App;
