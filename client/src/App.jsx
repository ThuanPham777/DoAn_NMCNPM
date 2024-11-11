import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Team from './pages/Team';
import MatchSchedule from './pages/MatchSchedule';
import RoundResult from './pages/RoundResult';
import Rank from './pages/Rank';
import TopSoccers from './pages/TopSoccers';
import SearchSoccers from './pages/SearchSoccers';
import TournamentRules from './pages/TournamentRules';
import CreateTournament from './pages/CreateTournament';
import AddMatchSchedule from './pages/AddMatchSchedule';
import UpdateMatchResult from './pages/UpdateMatchResult';

function Layout() {
  return (
    <div className='w-full h-screen flex flex-col md:flex-row'>
      {/* Sidebar */}
      <div className='w-1/5 h-screen bg-gray-800 text-white sticky top-0 hidden md:block overflow-y-auto'>
        <Sidebar />
      </div>

      {/* Main content with Navbar */}
      <div className='flex-1 flex flex-col overflow-y-auto'>
        <Navbar />
        <div className='p-4 2xl:px-10 flex-grow'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className='w-full min-h-screen bg-[#f3f4f6]'>
      <Router>
        <Routes>
          <Route
            path='/login'
            element={<Login />}
          />
          <Route
            path='/register'
            element={<Register />}
          />

          <Route element={<Layout />}>
            <Route
              path='/'
              element={<Home />}
            />
            <Route
              path='/team'
              element={<Team />}
            />
            <Route
              path='/match-schedule'
              element={<MatchSchedule />}
            />
            <Route
              path='/round-result'
              element={<RoundResult />}
            />
            <Route
              path='/rank'
              element={<Rank />}
            />
            <Route
              path='/top-soccers'
              element={<TopSoccers />}
            />
            <Route
              path='/search-soccers'
              element={<SearchSoccers />}
            />
            <Route
              path='/tournament-rule'
              element={<TournamentRules />}
            />
            <Route
              path='/create-tournament'
              element={<CreateTournament />}
            />
            <Route
              path='/add-match-schedule'
              element={<AddMatchSchedule />}
            />
            <Route
              path='/update-match-result/:id'
              element={<UpdateMatchResult />}
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
