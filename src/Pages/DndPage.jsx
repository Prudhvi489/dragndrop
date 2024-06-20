// // src/DndPage.js
// import React, { useState, useEffect } from "react";
// import { DndContext, useDroppable } from "@dnd-kit/core";
// import Draggable from "../components/Draggable";
// import { TextField } from "@mui/material";
// import Droppable from "../components/Droppable";
// import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "@firebase/firestore";
// import { db } from "../Firebase";
// import { useLocation, useNavigate } from "react-router-dom";
// const TextInputControl = ({ content, value, onChange }) => {
//   return (
//     <TextField
//       type="text"
//       placeholder={content}
//       value={value}
//       size="small"
//       autoComplete="off"
//       onChange={onChange}
//       onMouseDown={(e) => {
//         e.stopPropagation();
//       }}
//       onClick={(e) => {
//         e.stopPropagation();
//       }}
//     />
//   );
// };

// const DndPage = ({ onPublish, initialData }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [items, setItems] = useState(initialData || []);
//   const [loading, setLoading] = useState(false);

//   /**
//    * Handling drag and drop event by getting their properties
//    * @param {default} event 
//    */
//   const handleDragEnd = (event) => {
//     const {
//       active: { id },
//       delta: { x, y },
//     } = event;
//     setItems((prevItems) =>
//       prevItems.map((item) =>
//         item.id === id ? { ...item, x: item?.x + x, y: item?.y + y } : item
//       )
//     );
//   };

//   /**
//    * 
//    */
//   const handlePublish = async () => {
//     let file_data = {content:items,modified:serverTimestamp()}
//     if (!location?.state?.pageid) {
//       await addDoc(collection(db, "pages"), { content: file_data });
//     } else {
//       const pageRef = doc(db, "pages", location?.state?.pageid);
//       await updateDoc(pageRef, { content: file_data });
//     }
//     navigate("/")
//   };
//   const publish = () => {
//     const htmlContent = items.map(item => {
//       const style = `position: absolute; left: ${item.x}px; top: ${item.y}px;`;
//       if (item.type === "TextInput") {
//         return `<input type="text" placeholder="${item.content}" value="${item.value}" style="${style}" />`;
//       }
//       return '';
//     }).join('');

//     const newWindow = window.open("", "_blank");
//     newWindow.document.write(`
//       <html>
//         <head>
//           <title>Published Page</title>
//           <style>
//             body { position: relative; }
//           </style>
//         </head>
//         <body>
//           ${htmlContent}
//         </body>
//       </html>
//     `);
//     newWindow.document.close();
//   };

//   const addItem = (type) => {
//     const newItem = {
//       id: `item-${items.length}`,
//       type,
//       content: `New ${type}`,
//       x: 0,
//       y: 0,
//       value: "",
//     };
//     setItems([...items, newItem]);
//   };
//   const handleLoadPage = async (pageId) => {
//     setLoading(true);
//     const pageDoc = await getDoc(doc(db, "pages", pageId));
//     setItems(pageDoc.data().content.content);
//     // setInitialData(pageDoc.data().content.content);
//     // setSelectedPage(pageId);
//     setLoading(false);
//   }
//   const handlePreview = () => {
//     localStorage.setItem("previewData", JSON.stringify(items));
//     window.open("/preview", "_blank");
//   };
// useEffect(()=>{
//   if(location?.state?.pageid ){
//     handleLoadPage(location?.state?.pageid)
//   }
// },[])
//   return (
//     <>
//     {
//       location?.state?.view ?<>
//       {items.map((item, index) => {
//           return (
//               <Draggable id={item.id} x={item.x} y={item.y}>
//                 {item.type === "TextInput" && (
//                   <TextInputControl
//                     content={item?.content}
//                     value={item?.value}
//                     onChange={(e) => {
//                       e.stopPropagation();
//                       setItems((prevItems)=>{
//                         let tempitems= [...prevItems];
//                         tempitems[index].value = e.target.value;
//                         return tempitems
//                       })
//                     }}
//                   />
//                 )}
//               </Draggable>
//           );
//         })}
//       </>:<div>
//       <button onClick={() => addItem("TextInput")}>Add Text Input</button>
//       <button onClick={handlePublish}>Publish</button>
//       <button onClick={handlePreview}>Preview</button>
//       <DndContext onDragEnd={handleDragEnd}>
//         {items.map((item, index) => {
//           return (
//             <Droppable key={item.id} id={item.id}>
//               <Draggable id={item.id} x={item.x} y={item.y}>
//                 {item.type === "TextInput" && (
//                   <TextInputControl
//                     content={item?.content}
//                     value={item?.value}
//                     onChange={(e) => {
//                       e.stopPropagation();
//                       setItems((prevItems)=>{
//                         let tempitems= [...prevItems];
//                         tempitems[index].value = e.target.value;
//                         return tempitems
//                       })
//                     }}
//                   />
//                 )}
//               </Draggable>
//              </Droppable>
//           );
//         })}
//       </DndContext>
//     </div>
//     }
    
//     </>
//   );
// };

// export default DndPage;


import React, { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import Draggable from "../components/Draggable";
import { TextField, Button, Grid, CircularProgress, Dialog, DialogContent, DialogTitle, Divider, Typography, Stack, backdropClasses } from "@mui/material";
import Droppable from "../components/Droppable";
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "@firebase/firestore";
import { db } from "../Firebase";
import { useLocation, useNavigate } from "react-router-dom";

const TextInputControl = ({ content, value, onChange }) => {
  return (
    <TextField
      type="text"
      placeholder={content}
      value={value}
      size="small"
      autoComplete="off"
      onChange={onChange}
      fullWidth
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    />
  );
};

const DndPage = ({ initialData }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState(initialData || []);
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [labelval,setLabelval] = useState("")
  const handleDragEnd = (event) => {
    const {
      active: { id },
      delta: { x, y },
    } = event;
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, x: item.x + x, y: item.y + y } : item
      )
    );
  };

  const handlePublish = async () => {
    setLoading(true);
    const file_data = { content: items, modified: serverTimestamp() };
    if (!location?.state?.pageid) {
      await addDoc(collection(db, "pages"), { content: file_data });
    } else {
      const pageRef = doc(db, "pages", location?.state?.pageid);
      await updateDoc(pageRef, { content: file_data });
    }
    setLoading(false);
    navigate("/");
  };

  const handleLoadPage = async (pageId) => {
    setLoading(true);
    const pageDoc = await getDoc(doc(db, "pages", pageId));
    setItems(pageDoc.data().content.content);
    setLoading(false);
  };

  const handlePreview = () => {
    localStorage.setItem("previewData", JSON.stringify(items));
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  const addItem = (type) => {
    if(labelval === "") return;
    const newItem = {
      id: `item-${items.length}`,
      type,
      content: labelval,
      x: 20,
      y:items.length === 0 ?180:items[items.length-1].y+50,
      value: "",
    };
    setItems([...items, newItem]);
    setLabelval("");
  };

  useEffect(() => {
    if (location?.state?.pageid) {
      handleLoadPage(location?.state?.pageid);
    }
  }, []);

  return (
    <div style={{ padding: 20 }}>
      {loading && <CircularProgress />}
      {location?.state?.view ? (
        <>
          {items.map((item,index) =>{
                return (
                  <>
                    <Draggable id={item.id} x={item?.x} y={item?.y} sx={{backgroundColor:'white'}}>
                      <Grid container  spacing={1} sx={{backgroundColor:'white'}} alignItems={'center'}>
                        <Grid item md={3}><Typography variant="span">{` ${item?.content}`}:</Typography></Grid>
                        <Grid item md={9}>
                        {item.type === "TextInput" && (
                        <TextField
                        size="small"
                        fullWidth
                        placeholder={`Enter your ${item?.content}`}
                          content={item?.content}
                          value={item?.value}
                          onChange={(e) => {
                            e.stopPropagation();
                            setItems((prevItems) => {
                              const tempItems = [...prevItems];
                              tempItems[index].value = e.target.value;
                              return tempItems;
                            });
                          }}
                        />
                      )}
                        </Grid>
                      </Grid>
                     
                    </Draggable>
                    
                    </> 
                    
                )
              })}
        </>
      ) : (
        <Grid container height={'100vh'}>
        <Grid item container direction={'column'} md={3.5} spacing={2}>
        <Grid item><Typography variant="h4">Choose Control</Typography></Grid>
        <Grid item>
          <Stack spacing={1}>
            <Grid item><Typography variant="h6">Choose label</Typography></Grid>
            <Grid item container spacing={1}><Grid item md={8}><TextField size="small" fullWidth placeholder="Enter label"  value={labelval} onChange={(e)=>setLabelval(e.target.value)}/></Grid><Grid item md={4}>
            <Button variant="contained" color="primary" sx={{textTransform:'none'}} onClick={() => addItem("TextInput")}>
              Add Label
            </Button> </Grid></Grid>
            <Grid item> </Grid>
          </Stack>
        </Grid>
         
         
          <Grid item>
            <DndContext onDragEnd={handleDragEnd}>
              {items.map((item,index) =>{
                return (
                  // <Droppable key={item.id} id={item.id}>
                  <>
                    <Draggable id={item.id} x={item?.x} y={item?.y} sx={{backgroundColor:'white'}}>
                      <Grid container  spacing={1} sx={{backgroundColor:'white'}} alignItems={'center'}>
                        <Grid item md={3}><Typography variant="span">{` ${item?.content}`}:</Typography></Grid>
                        <Grid item md={9}>
                        {item.type === "TextInput" && (
                        <TextField
                        size="small"
                        fullWidth
                        placeholder={`Enter your ${item?.content}`}
                          content={item?.content}
                          value={item?.value}
                          onChange={(e) => {
                            e.stopPropagation();
                            setItems((prevItems) => {
                              const tempItems = [...prevItems];
                              tempItems[index].value = e.target.value;
                              return tempItems;
                            });
                          }}
                        />
                      )}
                        </Grid>
                      </Grid>
                     
                    </Draggable>
                    
                    </> 
                    
                  // </Droppable>
                )
              })}
            </DndContext>
          </Grid>
        </Grid>
        <Grid item md={0.1}><Divider  orientation="vertical" sx={{borderColor:'black'}}/></Grid>
        <Grid item md={7.9}>
          <Grid container spacing={1} justifyContent={'flex-end'}>
        <Grid item>
            <Button variant="contained" color="primary" sx={{textTransform:'none'}} onClick={handlePublish}>
              Publish
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" sx={{textTransform:'none'}} onClick={handlePreview}>
              Preview
            </Button>
          </Grid>
          </Grid>
        </Grid>
        </Grid>
      )}
      <Dialog open={previewOpen} onClose={handleClosePreview} fullWidth maxWidth="lg">
        <DialogTitle>Preview</DialogTitle>
        <DialogContent>
          <div>
            {items.map((item) => {
              const style = `position: absolute; left: ${item.x}px; top: ${item.y}px;`;
              if (item.type === "TextInput") {
                return (
                  <input
                    key={item.id}
                    type="text"
                    placeholder={item.content}
                    value={item.value}
                    style={style}
                    readOnly
                  />
                );
              }
              return null;
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DndPage;

