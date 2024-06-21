import {
  Grid,
  Typography,
  TextField,
  Stack,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Draggable from "../components/Draggable";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getDoc, doc } from "@firebase/firestore";
import { db } from "../Firebase";
const PreviewPage = () => {
  const { pageid } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableval, setTableval] = useState([]);
  const [other_elements, setOther_elements] = useState({
    divider: { x: 20, y: 400 },
    table: { x: 20, y: 300 },
    button: { x: 20, y: 500 },
  });
  /**
   * Formdata to be entering in the table
   * @returns
   */
  const Handleadd_data = () => {
    if (items?.length === 0) return;
    for(let i=0;i<=items?.length-1;i++){
      if(items[i].value.trim() === ""){
        alert("Please enter the values");
        return;
      }
    }
    const result = {};
    items.forEach((item) => {
      result[item.content] = item.value;
    });
    setTableval((prev) => [...prev, result]);
    const updated_state = items.map((obj) => ({ ...obj, value: "" }));
    setItems(updated_state);
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
    setLoading(false)
    console.log(err)
  }
  };
  useEffect(() => {
    if (pageid) {
      handleLoadPage(pageid);
    }
  }, [pageid]);
  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="success" />
      </Backdrop>
      <Grid
        item
        sx={{ backgroundColor: "#001f3f", color: "white", padding: "10px" }}
      >
        <Typography variant="h4" align="center">
          Dynamic Page builder
        </Typography>
      </Grid>
      {items.map((item, index) => {
        return (
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
                  <Typography variant="span" sx={{ fontWeight: "bold" }}>
                    {` ${item?.content}`} :
                  </Typography>
                </Grid>
                <Grid item md={9}>
                  {item.type === "TextInput" && (
                    <TextField
                      size="small"
                      fullWidth
                      autoComplete="off"
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
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          background: `#F2F2F2!important`,
                          borderRadius: `0.5rem`,
                          "& fieldset": {
                            border: "none",
                          },
                        },
                        "& .MuiOutlinedInput-input:-webkit-autofill": {
                          "-webkit-box-shadow": `0 0 0 30px #F2F2F2 inset !important`,
                          background: "transparent !important",
                        },
                        border: "none!important",
                      }}
              
                    />
                  )}
                </Grid>
              </Grid>
            </Draggable>
          </>
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
                        minWidth: "10",
                        borderRight: "1px solid #DAE2E4",
                        backgroundColor: "#799FAA",
                        padding: "0px 16px",
                        color: "white",
                        fontWeight: 700,
                        fontSize: "16px",
                        height: "46px",
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
                            borderRight: "1px solid #799FAA", // #DAE2E4
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
          sx={{ textTransform: "none", backgroundColor: "#001f3f!important" }}
          onClick={Handleadd_data}
        >
          Add
        </Button>
      </Draggable>
    </>
  );
};

export default PreviewPage;
