import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Schema from "./components/Schema";
import ButtonAppBar from "./components/AppBar";
import Search from "./components/Search";
import Relationships from "./components/Relationships";
import ResultsTableMaterial from "./components/ResultTable";

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
    width: "100%",
  },
  tableContainer: {
    position: "fixed",
    bottom: 0,
    right: 0,
    left: drawerWidth,
  },
}));

export const QueryContext = React.createContext();

export default function Content() {
  const classes = useStyles();
  const [query, setQuery] = React.useState("");

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
        <QueryContext.Provider value={[query, setQuery]}>
          <Search />
          <div className={classes.tableContainer}>
            <ResultsTableMaterial />
          </div>
        </QueryContext.Provider>
      </main>
    </div>
  );
}
