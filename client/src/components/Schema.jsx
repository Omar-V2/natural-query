import React from "react";
import { DatabaseContext } from "../App";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Collapse from "@material-ui/core/Collapse";
import { RiTableLine } from "react-icons/ri";
import { FiKey } from "react-icons/fi";
import { MdRefresh } from "react-icons/md";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

import {
  Typography,
  IconButton,
  Divider,
  ListSubheader,
} from "@material-ui/core";
import { FaDatabase } from "react-icons/fa";
import axios from "../axios";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  itemText: {
    fontSize: 15,
    fontWeight: 500,
    color: "inherit",
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  iconLeft: {
    marginLeft: theme.spacing(1),
  },
  iconTextContainer: {
    display: "flex",
    alignItems: "center",
  },
  iconRotate: {
    marginLeft: theme.spacing(2),
    transform: "rotateY(180deg)",
  },
  formControl: {
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(2),
    minWidth: 150,
  },
}));

function Table({ tableName, attributes }) {
  const classes = useStyles();
  // const attributes = [];
  const [isOpen, setOpen] = React.useState(false);
  const handleClick = () => setOpen(!isOpen);
  return (
    <React.Fragment>
      <ListItem button onClick={handleClick}>
        <ListItemIcon>
          <RiTableLine size="25" />
        </ListItemIcon>
        <ListItemText primary={tableName} />
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {attributes.map((attr, index) => (
            <ListItem key={index} className={classes.nested} dense>
              <ListItemText primary={`${attr.name}: ${attr.type}`} />
              {attr["primary key"] || attr["foreign key"] ? (
                <ListItemIcon className={classes.iconTextContainer}>
                  <Typography>{attr["primary key"] ? "PK" : "FK"}</Typography>
                  <FiKey className={classes.iconLeft} />
                </ListItemIcon>
              ) : null}
            </ListItem>
          ))}
        </List>
      </Collapse>
    </React.Fragment>
  );
}

export default function Schema({ dbName }) {
  const [currentDb, setCurrentDb] = React.useContext(DatabaseContext);
  const classes = useStyles();
  // const tables = ["Students", "Staff", "Classes", "Societies"];
  let tables;
  let columns;
  if (Object.keys(currentDb).length !== 0) {
    tables = currentDb.tables.map((table) => table.name);
    columns = currentDb.tables.map((table) => table.columns);
  }

  return (
    <React.Fragment>
      <SimpleSelect />
      <Divider />
      <List
        component="nav"
        subheader={
          <ListSubheader disableSticky className={classes.iconTextContainer}>
            <RiTableLine className={classes.icon} /> {currentDb.database} Schema
          </ListSubheader>
        }
      >
        {/* Add colour coding here - different colour for table, attribute,
          relationship, built in functions
          Use css circles to create color identifier
          Also include a legend somewhere - probably above title */}

        {tables ? (
          tables.map((table, index) => (
            <Table key={index} tableName={table} attributes={columns[index]} />
          ))
        ) : (
          <Typography paragraph style={{ margin: 10 }}>
            Connect or select a database and the schema will appear here!
          </Typography>
        )}
        <Divider />
      </List>
    </React.Fragment>
  );
}

function SimpleSelect() {
  const classes = useStyles();
  const [db, setDb] = React.useState(-1);
  const [currentDb, setCurrentDb] = React.useContext(DatabaseContext);
  const [availableDbs, setAvailableDbs] = React.useState([]);

  React.useEffect(() => {
    const getDbs = async () => {
      const response = await axios.get("/db");
      setAvailableDbs(response.data);
      console.log(response.data);
    };
    getDbs();
  }, [db, currentDb]);

  const handleChange = (event) => {
    setDb(event.target.value);
    console.log(event.target.value);
    console.log(availableDbs[event.target.value]);
    setCurrentDb(availableDbs[event.target.value]);
  };

  const dbNames = availableDbs.map((db) => db.database);

  return (
    <React.Fragment>
      <FormControl className={classes.formControl}>
        <InputLabel>
          <FaDatabase /> Current DB
        </InputLabel>
        <Select value={db} onChange={handleChange}>
          {dbNames.map((name, index) => (
            <MenuItem key={index} value={index}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <IconButton className={classes.icon}>
        <MdRefresh />
      </IconButton>
    </React.Fragment>
  );
}
