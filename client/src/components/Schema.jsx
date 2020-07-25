import React from "react";
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

function Table({ tableName }) {
  const classes = useStyles();
  const attibutes = [
    { name: "ID", type: "INT64", pk: true, fk: false },
    { name: "First Name", type: "VARCHAR(30)", pk: false, fk: true },
    { name: "last name", type: "VARCHAR(30)", pk: false, fk: false },
  ];
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
          {attibutes.map((attr, index) => (
              <ListItem key={index} className={classes.nested} dense>
                <ListItemText primary={`${attr.name}: ${attr.type}`} />
                {attr.pk || attr.fk ? (
                  <ListItemIcon className={classes.iconTextContainer}>
                    <Typography>{attr.pk ? "PK" : "FK"}</Typography>
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
  const classes = useStyles();
  const tables = ["Students", "Staff", "Classes", "Societies"];
  return (
    <React.Fragment>
      <SimpleSelect />
      <Divider />
      <List
        component="nav"
        subheader={
          <ListSubheader disableSticky className={classes.iconTextContainer}>
            <RiTableLine className={classes.icon} /> Schema
          </ListSubheader>
        }
      >
        {/* Add colour coding here - different colour for table, attribute,
          relationship, built in functions
          Use css circles to create color identifier
          Also include a legend somewhere - probably above title */}
        {tables.map((table, index) => (
          <Table key={index} tableName={table} />
        ))}
        <Divider />
      </List>
    </React.Fragment>
  );
}

function SimpleSelect() {
  const classes = useStyles();
  const [db, setDb] = React.useState("UCL CS");

  const handleChange = (event) => {
    setDb(event.target.value);
  };

  return (
    <React.Fragment>
      <FormControl className={classes.formControl}>
        <InputLabel>
          <FaDatabase /> Current DB
        </InputLabel>
        <Select value={db} onChange={handleChange}>
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={"UCL CS"}>UCL CS</MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
      <IconButton className={classes.icon}>
        <MdRefresh />
      </IconButton>
    </React.Fragment>
  );
}
