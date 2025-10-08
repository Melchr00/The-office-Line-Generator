/*** Root application component. ***/
import { Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Account from './components/Account'

import './index.css'
import LineGenerator from './components/LineGenerator';

function App() {

  return (
    
    <Routes>
      <Route path="*" element={<LineGenerator />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/account" element={<Account />} />
    </Routes>
  );
}

export default App;
