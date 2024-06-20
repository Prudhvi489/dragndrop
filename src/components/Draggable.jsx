
import React from 'react';
import {useDraggable} from '@dnd-kit/core';

 function Draggable({id,x,y,...props}) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id
  });
  const style = {
    position: 'absolute',
    left: transform ? `${transform.x + x}px` : `${x}px`,
    top: transform ? `${transform.y + y}px` : `${y}px`,
    border:'0px',
    padding:"0px"
  };
  
  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}
export default Draggable