import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { FaDatabase } from "react-icons/fa";
import { MdTranslate, MdEdit } from "react-icons/md";
import { BsPlug } from "react-icons/bs";
import FormDialog from "./Dialog";
import { RiArrowLeftRightLine } from "react-icons/ri";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  logo: {
    marginRight: theme.spacing(1),
  },
  firstButton: {
    marginLeft: theme.spacing(4),
  },
  button: {
    marginLeft: theme.spacing(3),
  },
  buttonIcon: {
    marginLeft: theme.spacing(1),
  },
  title: {
    marginLeft: theme.spacing(1),
  },
}));

export default function ButtonAppBar({ title }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleNewConnection = () => setOpen(true);

  return (
    <div className={classes.root}>
      <AppBar position="fixed" color="inherit" className={classes.appBar}>
        <Toolbar variant="dense">
          <MdTranslate size="25" />
          <RiArrowLeftRightLine size="25" />
          <FaDatabase size="25" />
          <Typography
            variant="h6"
            noWrap
            className={classes.title}
            color="secondary"
          >
            {title}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            className={classes.firstButton}
            onClick={() => handleNewConnection()}
          >
            New Connection
            <BsPlug className={classes.buttonIcon} size="18" />
          </Button>
          <Button
            variant="contained"
            size="small"
            color="primary"
            className={classes.button}
          >
            Manage Databases
            <MdEdit className={classes.buttonIcon} size="18" />
          </Button>
        </Toolbar>
      </AppBar>
      <FormDialog
        title="New Database Connection"
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
}
