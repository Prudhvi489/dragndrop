import React, { useState, useEffect } from "react";
import { getDocs, collection, doc, deleteDoc } from "@firebase/firestore";
import { db } from "../Firebase";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { Lastmodifiedtime } from "../utils/Helperfunctions";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";
import { useNavigate } from "react-router-dom";
import nodatafound from '../assets/nodatafound.jpeg'
import nodatafound1 from '../assets/nodatafound1.jpeg'

const Mainpage = () => {
  const navigate = useNavigate();
  const [existingPages, setExistingPages] = useState([]);
  const [loading, setLoading] = useState(false);
  /**
   * Retrieveing the html templates from the firebase
   */
  const fetchPages = async () => {
    setLoading(true);
    try{
    const querySnapshot = await getDocs(collection(db, "pages"));
    const pages = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data().content,
      modified: doc.data().modified,
    }));
    setExistingPages(pages);
    setLoading(false);
  }
  catch(err){
    setLoading(false);
    console.log(err);
  }
  };
 

  const handledeletePage = async (pageId) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, "pages", pageId));
      setLoading(false);
      setExistingPages(existingPages.filter((page) => page.id !== pageId));
    } catch (err) {
      setLoading(false)
      console.log(err);
    }
  };
  useEffect(() => {
    fetchPages();
  }, []);
  
  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="success" />
      </Backdrop>
      <Grid item sx={{ backgroundColor: "#001f3f", color: "white",padding:'10px' }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Dynamic Page Builder
        </Typography>
        </Grid>
      <Container maxWidth="lg" pt={3}>
        
        <Button
          variant="contained"
          sx={{textTransform:'none',backgroundColor:"#001f3f!important",marginTop:'1rem'}}
          color="primary"
          onClick={() =>
            // handleLoadPage(page.id)
            navigate("/createeditpage")
          }
        >
          Create New
        </Button>
        {existingPages.length > 0 ? (
          <>
            <Typography
              variant="h5"
              component="h3"
              style={{ margin: "20px 0" }}
            >
              Edit Existing
            </Typography>
            <Grid container spacing={2}>
              {existingPages.map((page) => {
                return (
                  <Grid item xs={12} sm={6} md={4} key={page.id}>
                    <Card style={{ cursor: "pointer" }}>
                      <CardContent>
                        <Typography variant="h6" component="h2">
                          Page ID: {page.id}
                        </Typography>
                        <Typography color="textSecondary">
                          Last modified: {Lastmodifiedtime(page?.modified)}
                        </Typography>
                        <Grid container justifyContent={"flex-end"} mt={1}>
                          <Grid item container md={4}>
                            <Grid item md={4}>
                              <CreateIcon
                                onClick={() =>
                                  // handleLoadPage(page.id)
                                  navigate("/createeditpage", {
                                    state: { pageid: page?.id, view: false },
                                  })
                                }
                              />
                            </Grid>
                            <Grid item md={4}>
                              <VisibilityIcon
                                onClick={() =>
                                  // handleLoadPage(page.id)
                                  navigate(`/viewpage/${page?.id}`)
                                }
                              />
                            </Grid>
                            <Grid item md={4}>
                              <DeleteIcon
                                sx={{ color: "red" }}
                                onClick={() => handledeletePage(page.id)}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </>
        ) : (
          <Grid container direction={"column"} alignItems="center" justifyContent="center">
            <Grid item>Please Create your template</Grid>
            <Grid item>
          <img src={nodatafound1} width="100%" height="100%" alt={"no data found"}/>
          </Grid>
          </Grid>
          
        )}
      </Container>
    </>
  );
};

export default Mainpage;
