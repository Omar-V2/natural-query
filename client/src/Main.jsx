import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Schema from "./components/Schema";
import ButtonAppBar from "./components/AppBar";
import Search from "./components/Search";
import Relationships from "./components/Relationships";
import ResultsTable from "./components/ResultTable";

const drawerWidth = 275;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  tableContainer: {
    position: "fixed",
    bottom: 0,
    right: 0,
    left: drawerWidth,
  },
}));

export default function Content() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <ButtonAppBar title="Natural Query" />
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <Schema dbName="UCL CS" />
          <Relationships />
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        <Search />
        <br />
        <Typography paragraph>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tenetur
          magnam quibusdam ipsam itaque aspernatur, nemo, totam adipisci tempora
          sunt perspiciatis hic assumenda iusto vero ullam temporibus doloremque
          repudiandae laborum natus.
        </Typography>
        <div className={classes.tableContainer}>
          <ResultsTable />
        </div>
      </main>
    </div>
  );
}
