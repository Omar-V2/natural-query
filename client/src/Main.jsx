import React from "react";
import { DatabaseContext } from "./App";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Schema from "./components/Schema";
import ButtonAppBar from "./components/AppBar";
import Search from "./components/Search";
import Relationships from "./components/Relationships";
import ResultsTable, { ResultsTableMaterial } from "./components/ResultTable";
import { Button } from "@material-ui/core";

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

const TempDb = {
  database: "UCL",
  tables: [
    {
      name: "Other Staff",
      columns: [
        {
          name: "id",
          type: "INTEGER()",
          "primary key": true,
          "foreign key": false,
        },
        {
          name: "fname",
          type: "VARCHAR(length=30)",
          "primary key": false,
          "foreign key": false,
        },
        {
          name: "lname",
          type: "VARCHAR(length=30)",
          "primary key": false,
          "foreign key": false,
        },
        {
          name: "age",
          type: "INTEGER()",
          "primary key": false,
          "foreign key": false,
        },
        {
          name: "email",
          type: "VARCHAR(length=30)",
          "primary key": false,
          "foreign key": false,
        },
      ],
      relationships: [
        {
          table: "classes",
          "parent column": "id",
          "foreign column": "staff_id",
          identifier: null,
        },
      ],
    },
    {
      name: "Other Classes",
      columns: [
        {
          name: "id",
          type: "INTEGER()",
          "primary key": true,
          "foreign key": false,
        },
        {
          name: "name",
          type: "VARCHAR(length=30)",
          "primary key": false,
          "foreign key": false,
        },
        {
          name: "code",
          type: "VARCHAR(length=30)",
          "primary key": false,
          "foreign key": false,
        },
        {
          name: "location",
          type: "VARCHAR(length=50)",
          "primary key": false,
          "foreign key": false,
        },
        {
          name: "level",
          type: "VARCHAR(length=30)",
          "primary key": false,
          "foreign key": false,
        },
        {
          name: "staff_id",
          type: "INTEGER()",
          "primary key": false,
          "foreign key": true,
        },
      ],
      relationships: [
        {
          table: "enrolments",
          "parent column": "id",
          "foreign column": "class_id",
          identifier: null,
        },
      ],
    },
    {
      name: "Other Students",
      columns: [
        {
          name: "id",
          type: "INTEGER()",
          "primary key": true,
          "foreign key": false,
        },
        {
          name: "fname",
          type: "VARCHAR(length=30)",
          "primary key": false,
          "foreign key": false,
        },
        {
          name: "lname",
          type: "VARCHAR(length=30)",
          "primary key": false,
          "foreign key": false,
        },
        {
          name: "age",
          type: "INTEGER()",
          "primary key": false,
          "foreign key": false,
        },
        {
          name: "email",
          type: "VARCHAR(length=30)",
          "primary key": false,
          "foreign key": false,
        },
      ],
      relationships: [
        {
          table: "societies",
          "parent column": "id",
          "foreign column": "student_id",
          identifier: null,
        },
        {
          table: "enrolments",
          "parent column": "id",
          "foreign column": "student_id",
          identifier: null,
        },
      ],
    },
    {
      name: "Other Societies",
      columns: [
        {
          name: "id",
          type: "INTEGER()",
          "primary key": true,
          "foreign key": false,
        },
        {
          name: "name",
          type: "VARCHAR(length=30)",
          "primary key": false,
          "foreign key": false,
        },
        {
          name: "student_id",
          type: "INTEGER()",
          "primary key": false,
          "foreign key": true,
        },
      ],
      relationships: [],
    },
    {
      name: "Other Enrolments",
      columns: [
        {
          name: "id",
          type: "INTEGER()",
          "primary key": true,
          "foreign key": false,
        },
        {
          name: "class_id",
          type: "INTEGER()",
          "primary key": false,
          "foreign key": true,
        },
        {
          name: "student_id",
          type: "INTEGER()",
          "primary key": false,
          "foreign key": true,
        },
      ],
      relationships: [],
    },
  ],
};

const TempDbTwo = {
  database: "UCL",
  host: "sqldb",
  tables: [
    {
      name: "staff",
      columns: [
        {
          name: "id",
          type: "INTEGER()",
          "primary key": true,
          "foreign key": false,
        },
        {
          name: "fname",
          type: "VARCHAR(length=30)",
          "primary key": false,
          "foreign key": false,
        },
        {
          name: "lname",
          type: "VARCHAR(length=30)",
          "primary key": false,
          "foreign key": false,
        },
        {
          name: "age",
          type: "INTEGER()",
          "primary key": false,
          "foreign key": false,
        },
        {
          name: "email",
          type: "VARCHAR(length=30)",
          "primary key": false,
          "foreign key": false,
        },
      ],
      relationships: [
        {
          table: "classes",
          "parent column": "id",
          "foreign column": "staff_id",
          identifier: "teaching",
        },
      ],
    },
    {
      name: "classes",
      columns: [
        {
          name: "id",
          type: "INTEGER()",
          "primary key": true,
          "foreign key": false,
        },
        {
          name: "name",
          type: "VARCHAR(length=30)",
          "primary key": false,
          "foreign key": false,
        },
        {
          name: "code",
          type: "VARCHAR(length=30)",
          "primary key": false,
          "foreign key": false,
        },
        {
          name: "location",
          type: "VARCHAR(length=50)",
          "primary key": false,
          "foreign key": false,
        },
        {
          name: "level",
          type: "VARCHAR(length=30)",
          "primary key": false,
          "foreign key": false,
        },
        {
          name: "staff_id",
          type: "INTEGER()",
          "primary key": false,
          "foreign key": true,
        },
      ],
      relationships: [
        {
          table: "enrolments",
          "parent column": "id",
          "foreign column": "class_id",
          identifier: "classes-enrol",
        },
      ],
    },
    {
      name: "students",
      columns: [
        {
          name: "id",
          type: "INTEGER()",
          "primary key": true,
          "foreign key": false,
        },
        {
          name: "fname",
          type: "VARCHAR(length=30)",
          "primary key": false,
          "foreign key": false,
        },
        {
          name: "lname",
          type: "VARCHAR(length=30)",
          "primary key": false,
          "foreign key": false,
        },
        {
          name: "age",
          type: "INTEGER()",
          "primary key": false,
          "foreign key": false,
        },
        {
          name: "email",
          type: "VARCHAR(length=30)",
          "primary key": false,
          "foreign key": false,
        },
      ],
      relationships: [
        {
          table: "societies",
          "parent column": "id",
          "foreign column": "student_id",
          identifier: null,
        },
        {
          table: "enrolments",
          "parent column": "id",
          "foreign column": "student_id",
          identifier: "student-enrol",
        },
      ],
    },
    {
      name: "societies",
      columns: [
        {
          name: "id",
          type: "INTEGER()",
          "primary key": true,
          "foreign key": false,
        },
        {
          name: "name",
          type: "VARCHAR(length=30)",
          "primary key": false,
          "foreign key": false,
        },
        {
          name: "student_id",
          type: "INTEGER()",
          "primary key": false,
          "foreign key": true,
        },
      ],
      relationships: [],
    },
    {
      name: "enrolments",
      columns: [
        {
          name: "id",
          type: "INTEGER()",
          "primary key": true,
          "foreign key": false,
        },
        {
          name: "class_id",
          type: "INTEGER()",
          "primary key": false,
          "foreign key": true,
        },
        {
          name: "student_id",
          type: "INTEGER()",
          "primary key": false,
          "foreign key": true,
        },
      ],
      relationships: [],
    },
  ],
};

export default function Content() {
  const classes = useStyles();
  const [currentDb, setCurrentDb] = React.useContext(DatabaseContext);
  const updateContext = () => setCurrentDb(TempDbTwo);
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
        <Button color="primary" variant="outlined" onClick={updateContext}>
          Update Context Test
        </Button>
        <Typography>{JSON.stringify(currentDb)}</Typography>
        <div className={classes.tableContainer}>
          {/* <ResultsTable /> */}
          <ResultsTableMaterial />
        </div>
      </main>
    </div>
  );
}
