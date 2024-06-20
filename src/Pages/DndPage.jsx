import React, { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import Draggable from "../components/Draggable";
import {
  TextField,
  Button,
  Grid,
  CircularProgress,
  Divider,
  Typography,
  Stack,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableBody,
  Backdrop,
} from "@mui/material";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";
import { db } from "../Firebase";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";
const DndPage = ({ initialData }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState(initialData || []);
  const [searchparams, setSerachparams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [labelval, setLabelval] = useState("");
  const [editlabel, setEditlabel] = useState({});
  const [tableval, setTableval] = useState([]);
  const [preview, setPreview] = useState(false);
  const [other_elements, setOther_elements] = useState({
    divider: { x: 20, y: 400 },
    table: { x: 20, y: 300 },
    button: { x: 20, y: 500 },
  });
  /**
   * Getting the X,Y axis coordinates to save the position
   * @param {default} event
   */
  const handleDragEnd = (event) => {
    const {
      active: { id },
      delta: { x, y },
    } = event;
    if (["table", "divider", "button"].includes(id)) {
      setOther_elements((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          x: prev[id].x ? prev[id].x + x : x,
          y: prev[id].y ? prev[id].y + y : y,
        },
      }));
    } else {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, x: item.x + x, y: item.y + y } : item
        )
      );
    }
  };
  /**Saving the html template in json formate */
  const handlePublish = async () => {
    if(items?.length === 0){
      alert("Please add some content");
      return;
    }
    setLoading(true);
    try{

    const file_data = {
      content: items,
      modified: serverTimestamp(),
      other_elements: other_elements,
    };
    let docid;
    if (!location?.state?.pageid) {
      const docref = await addDoc(collection(db, "pages"), file_data);
      docid = docref?.id;
    } else {
      const pageRef = doc(db, "pages", location?.state?.pageid);
      await updateDoc(pageRef, file_data);
      docid = location?.state?.pageid;
    }
    setLoading(false);
    const url = `/viewpage/${docid}`;
    window.open(url, "_blank");
    // navigate("/");
  }
  catch(err){
    setLoading(false)
    console.log(err)
  }
  };

  /**Retrieving the html template from the firebase */
  const handleLoadPage = async (pageId) => {
    setLoading(true);
    try{
      const pageDoc = await getDoc(doc(db, "pages", pageId));
      setItems(pageDoc.data().content);
      setOther_elements(pageDoc.data().other_elements);
      setLoading(false);
    }
    catch(err){
      setLoading(false);
      console.log(err)
    }
    
  };

  const handlePreview = () => {
    setPreview(true);
    navigate("/createeditpage?preview=1", { state: { items, other_elements } });
  };

  /**
   * Formdata to be entering in the table
   * @returns
   */
  const Handleadd_data = () => {
    if (items?.length === 0) return;
    const result = {};
    items.forEach((item) => {
      result[item.content] = item.value;
    });
    setTableval((prev) => [...prev, result]);
    const updated_state = items.map((obj) => ({ ...obj, value: "" }));
    setItems(updated_state);
  };
  /**
   * Adding item to the page
   * @param {string} type
   * @returns
   */
  const addItem = (type) => {
    if (labelval === "") return;
    if (editlabel?.id) {
      setItems((prev) => {
        let temp = [...prev];
        temp[editlabel.editindex].content = labelval;
        return temp;
      });
    } else {
      const newItem = {
        id: `item-${items.length}`,
        type,
        content: labelval,
        x: 20,
        y: items.length === 0 ? 180 : items[items.length - 1].y + 50,
        value: "",
      };
      setItems([...items, newItem]);
    }
    setEditlabel({});
    setLabelval("");
  };
  const handleeditlabel = (item, editindex) => {
    setEditlabel({ ...item, editindex });
    setLabelval(item.content);
  };
  useEffect(() => {
    if (location?.state?.pageid) {
      handleLoadPage(location?.state?.pageid);
    }
    if (location?.state?.items && location?.state?.other_elements) {
      setItems(location?.state?.items);
      setOther_elements(location?.state?.other_elements);
    }
  }, []);

  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="success" />
      </Backdrop>
      {searchparams.get("preview") ? (
        <>
          <Grid item sx={{ backgroundColor: "#001f3f", color: "white",padding:'10px' }}>
            <Typography variant="h4" align="center">
              Dynamic Page builder
            </Typography>
          </Grid>
          {items.map((item, index) => {
            return (
              // <Droppable key={item.id} id={item.id}>
              <>
                <Draggable
                  id={item.id}
                  x={item?.x}
                  y={item?.y}
                  sx={{ backgroundColor: "white" }}
                >
                  <Grid
                    container
                    spacing={1}
                    sx={{ backgroundColor: "white" }}
                    alignItems={"center"}
                  >
                    <Grid item md={3}>
                      <Typography variant="span" sx={{fontWeight:'bold'}}>
                        {` ${item?.content}`}:
                      </Typography>
                    </Grid>
                    <Grid item md={9}>
                      {item.type === "TextInput" && (
                        <TextField
                          size="small"
                          autoComplete="off"
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
            );
          })}
          <Draggable
            id="divider"
            x={other_elements?.divider.x}
            y={other_elements?.divider?.y}
          >
            <Stack sx={{ backgroundColor: "white", alignItems: "center" }}>
              <Divider sx={{ border: "1px solid black", width: "100%" }} />
              <Typography
                variant="span"
                sx={{ mx: 22, display: "block", width: "100%" }}
              >
                ...
              </Typography>
              <Divider sx={{ border: "1px solid black", width: "100%" }} />
            </Stack>
          </Draggable>
          <Draggable
            id={"table"}
            x={other_elements?.table?.x}
            y={other_elements?.table?.y}
          >
            <TableContainer sx={{ backgroundColor: "white" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {items.map((item, index) => {
                      return (
                        <TableCell
                          style={{
                            width: "48px",
                            backgroundColor: "#799FAA",
                            borderRight: "1px solid #DAE2E4",
                            padding: "0px 16px",
                          }}
                        >
                          {item?.content}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: "#799faa14" }}>
                  {tableval.map((item, rowindex) => {
                    return (
                      <TableRow>
                        {items.map((val, colindex) => {
                          return (
                            <TableCell
                              style={{
                                borderRight: "1px solid red!important", // #DAE2E4
                                borderBottom: "2px solid #fff",
                                marginLeft: "1rem",
                              }}
                            >
                              {item[val?.content]}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Draggable>
          <Draggable
            id={"button"}
            x={other_elements?.button?.x}
            y={other_elements?.button?.y}
          >
            <Button
              disableRipple
              variant="contained"
              sx={{ textTransform: "none",backgroundColor:"#001f3f!important" }}
              onClick={Handleadd_data}
            >
              Add
            </Button>
          </Draggable>
        </>
      ) : (
        <Grid container height={"100vh"}>
          <Grid item container direction={"column"} md={3.5} spacing={1}>
            <Grid item>
              <Typography variant="h4">Choose Control</Typography>
            </Grid>
            <Grid item>
              <Stack spacing={1}>
                <Grid item>
                  <Typography variant="h6">Choose label</Typography>
                </Grid>
                <Grid item container spacing={1}>
                  <Grid item md={8}>
                    <TextField
                      autoComplete="off"
                      size="small"
                      fullWidth
                      placeholder="Enter label"
                      value={labelval}
                      onChange={(e) => setLabelval(e.target.value)}
                    />
                  </Grid>
                  <Grid item md={4}>
                    <Button
                      disableRipple
                      variant="contained"
                      color="primary"
                      sx={{ textTransform: "none",backgroundColor:"#001f3f!important" }}
                      onClick={() => addItem("TextInput")}
                    >
                      {editlabel?.id ? "Edit Label" : "Add Label"}
                    </Button>{" "}
                  </Grid>
                </Grid>
              </Stack>
            </Grid>

            <Grid item>
              <DndContext onDragEnd={handleDragEnd}>
                {items.map((item, index) => {
                  return (
                    // <Droppable key={item.id} id={item.id}>
                    <>
                      <Draggable
                        id={item.id}
                        x={item?.x}
                        y={item?.y}
                        sx={{ backgroundColor: "white" }}
                      >
                        <Grid
                          container
                          spacing={1}
                          sx={{ backgroundColor: "white" }}
                          alignItems={"center"}
                        >
                          <Grid item md={3}>
                            <Typography variant="span" sx={{fontWeight:"bold"}}>
                              {` ${item?.content}`}: 
                            </Typography>
                          </Grid>
                          <Grid item md={9}>
                            {item.type === "TextInput" && (
                              <TextField
                                size="small"
                                autoComplete="off"
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
                  );
                })}
                <Draggable
                  id="divider"
                  x={other_elements?.divider.x}
                  y={other_elements?.divider?.y}
                >
                  <Stack
                    sx={{ backgroundColor: "white", alignItems: "center" }}
                  >
                    <Divider
                      sx={{ border: "1px solid black", width: "100%" }}
                    />
                    <Typography
                      variant="span"
                      sx={{ mx: 22, display: "block", width: "100%" }}
                    >
                      ...
                    </Typography>
                    <Divider
                      sx={{ border: "1px solid black", width: "100%" }}
                    />
                  </Stack>
                </Draggable>
                <Draggable
                  id={"table"}
                  x={other_elements?.table?.x}
                  y={other_elements?.table?.y}
                >
                  <TableContainer sx={{ backgroundColor: "white" }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          {items.map((item, index) => {
                            return (
                              <TableCell
                                style={{
                                  minWidth: "10",
                                  borderRight: "1px solid #DAE2E4",
                                  backgroundColor: "#799FAA",
                                  padding: "0px 16px",
                                  fontWeight: 700,
                                  fontSize: "16px",
                                  height: "46px",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-evenly",
                                    alignItems: "center",
                                  }}
                                >
                                  <span> {item?.content}</span>
                                  <CreateIcon
                                    sx={{ color: "#1565c0" }}
                                    onPointerDown={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      handleeditlabel(item, index);
                                    }}
                                  />{" "}
                                  <DeleteIcon
                                    sx={{ color: "red" }}
                                    onPointerDown={(e) => {
                                      e.stopPropagation();
                                      let newArray = [...items];
                                      newArray.splice(index, 1);
                                      setItems(newArray);
                                    }}
                                  />
                                </div>
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      </TableHead>
                      <TableBody sx={{ backgroundColor: "#799faa14" }}>
                        {tableval.map((item, rowindex) => {
                          return (
                            <TableRow>
                              {items.map((val, colindex) => {
                                return (
                                  <TableCell
                                    style={{
                                      borderRight: "1px solid red!important", // #DAE2E4
                                      borderBottom: "2px solid #fff",
                                      marginLeft: "1rem",
                                    }}
                                  >
                                    {item[val?.content]}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Draggable>
                <Draggable
                  id={"button"}
                  x={other_elements?.button?.x}
                  y={other_elements?.button?.y}
                >
                  <Button
                    disableRipple
                    variant="contained"
                    sx={{ textTransform: "none",backgroundColor:"#001f3f!important" }}
                    onClick={Handleadd_data}
                  >
                    Add
                  </Button>
                </Draggable>
              </DndContext>
            </Grid>
          </Grid>
          <Grid item md={0.1}>
            <Divider orientation="vertical" sx={{ borderColor: "black" }} />
          </Grid>
          <Grid item md={8.3} sx={{maxWidth:'auto'}}>
            <Grid item sx={{ backgroundColor: "#001f3f", color: "white",padding:'10px' }}>
              <Typography variant="h4" align="center">
                Dynamic Page builder
              </Typography>
            </Grid>
            <Grid container spacing={1} justifyContent={"flex-end"} mt={1}>
              <Grid item>
                <Button
                  disableRipple
                  variant="contained"
                  color="primary"
                  sx={{ textTransform: "none",backgroundColor:"#001f3f!important" }}
                  onClick={handlePublish}
                >
                  Publish
                </Button>
              </Grid>
              <Grid item>
                <Button
                  disableRipple
                  variant="contained"
                  color="primary"
                  sx={{ textTransform: "none",backgroundColor:"#001f3f!important" }}
                  onClick={handlePreview}
                >
                  Preview
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default DndPage;
