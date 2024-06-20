import logo from './logo.svg';
import './App.css';
import { Route, Router, Routes } from 'react-router-dom';
import Mainpage from './Pages/Mainpage';
import React, {useState} from 'react';
import {DndContext} from '@dnd-kit/core';

import Droppable from './components/Droppable';
import Draggable from './components/Draggable';
import DndPage from './Pages/DndPage';
function App() {
  const [containers,setContainers] = useState([{val:'A',x:0,y:0,id:"id_1"}]);
  const [parent, setParent] = useState(null);
  const draggableMarkup = (
    <Draggable id="draggable">Drag me</Draggable>
  );
  function handleDragEnd(event) {
    console.log(event,"event")
    const {over,delta:{x,y},active:{id}} = event;
    console.log(x,y,"values")
    setContainers(prevItems => 
      prevItems.map(item => item.id === id ? { ...item, x: item?.x+x, y: item?.y+y } : item)
    );
    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    setParent(over ? over.id : null);
  }
  return (
    <div>
     <Routes>
      <Route path="/" element={<Mainpage/>} />
      <Route path="/createeditpage" element={<DndPage/>}/>
     </Routes>
   {/* <DndContext onDragEnd={handleDragEnd}>
      {parent === null ? draggableMarkup : null}

      {containers.map((val,index) => (
        // prop and pass it to `useDroppable`
        <Droppable key={index} id={`id_${index+1}`} >
          <Draggable id={val?.id} x={val?.x} y={val?.y} >Drag me</Draggable>

        </Droppable>
      ))}
    </DndContext> */}
    </div>
  );
}

export default App;
