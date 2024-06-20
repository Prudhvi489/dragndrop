import './App.css';
import { Route, Routes } from 'react-router-dom';
import Mainpage from './Pages/Mainpage';
import React from 'react';

import DndPage from './Pages/DndPage';
import PreviewPage from './Pages/PreviewPage';
function App() {
 
 
  return (
    <div>
     <Routes>
      <Route path="/" element={<Mainpage/>} />
      <Route path="/createeditpage" element={<DndPage/>}/>
      <Route path ="/viewpage/:pageid" element={<PreviewPage/>}/>
     </Routes>
   
    </div>
  );
}

export default App;
