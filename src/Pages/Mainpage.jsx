import React, { useState, useEffect } from "react";
import DndPage from "./DndPage";
import {
  getDocs,
  collection,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  deleteDoc,
} from "@firebase/firestore";
import { db } from "../Firebase";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { Lastmodifiedtime } from "../utils/Helperfunctions";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";
import { useNavigate } from "react-router-dom";
const Mainpage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState(null);
  const [existingPages, setExistingPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchPages = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "pages"));
      const pages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data().content,
      }));
      console.log(pages, "pages");
      setExistingPages(pages);
      setLoading(false);
    };

    fetchPages();
  }, []);

  const handledeletePage = async (pageId) => {
    try {
      setLoading(true);
      const pageDoc = await deleteDoc(doc(db, "pages", pageId));
      setLoading(false);
      setExistingPages(existingPages.filter((page) => page.id !== pageId));
    } catch (err) {
      console.log(err);
    }
  };
  const handlePublish = async (jsonData) => {
    let file_data = { content: jsonData, modified: serverTimestamp() };
    console.log(file_data, "Data");
    if (mode === "new") {
      await addDoc(collection(db, "pages"), { content: file_data });
    } else {
      const pageRef = doc(db, "pages", selectedPage);
      await updateDoc(pageRef, { content: file_data });
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

 

  return (
    <Container maxWidth="lg" pt={3}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Dynamic Page Builder
      </Typography>
      <Button
        variant="contained"
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
          <Typography variant="h5" component="h3" style={{ margin: "20px 0" }}>
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
                      {console.log(
                        new Date(page?.modified).toLocaleString(),
                        page?.modified,
                        "Data"
                      )}
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
                                  state: { pageid: page?.id,view:false },
                                })
                              }
                            />
                          </Grid>
                          <Grid item md={4}>
                            <VisibilityIcon
                              onClick={() =>
                                // handleLoadPage(page.id)
                                navigate("/createeditpage", {
                                  state: { pageid: page?.id,view:true },
                                })
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
        "No pages found"
      )}
    </Container>
  );
};

export default Mainpage;
