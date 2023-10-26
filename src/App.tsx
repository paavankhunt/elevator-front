import React from 'react';
import LiftComponent from './modules/LiftComponent';
import LogData from './modules/LogData';

function App() {
  return (
    <div className="App">
      {window.location.pathname === '/' ? <LiftComponent /> : <LogData />}
    </div>
  );
}

export default App;
