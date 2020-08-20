import React from "react";
import { DatabaseContext } from "../App";
import axios from "../axios";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  makeStyles,
  Typography,
  Backdrop,
  CircularProgress,
  withStyles,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  inputContainer: {
    display: "flex",
    flexDirection: "column",
  },
  textField: {
    margin: theme.spacing(1),
  },
  backDrop: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));

const WarningText = withStyles({
  root: {
    color: red[500],
  },
})(Typography);

export default function FormDialog({ title, open, setOpen }) {
  const classes = useStyles();
  const [currentDb, setCurrentDb] = React.useContext(DatabaseContext);

  const [host, setHost] = React.useState("sqldb");
  const [dbName, setDbName] = React.useState("UCL");
  const [dbLogin, setDbLogin] = React.useState("postgres");
  const [dbPass, setDbPass] = React.useState("root");
  const [connErr, setConnErr] = React.useState("");
  const [backDropOpen, setBackDropOpen] = React.useState(false);

  const inputInfo = [
    { label: "Host URL", value: host, update: setHost },
    { label: "Database Name", value: dbName, update: setDbName },
    { label: "Login", value: dbLogin, update: setDbLogin },
    { label: "Password", value: dbPass, update: setDbPass },
  ];

  const handleClose = () => setOpen(false);

  const handleConfirm = async () => {
    setBackDropOpen(true);
    try {
      const response = await axios.post("/db", {
        user: dbLogin,
        password: dbPass,
        host: host,
        dbname: dbName,
      });
      console.log(response.data);
      setCurrentDb(response.data);
      setConnErr("");
      handleClose();
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        setConnErr(error.response.data.message);
      } else if (error.request) {
        setConnErr("Error connecting to server");
      }
    } finally {
      setBackDropOpen(false);
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} disableBackdropClick>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <div className={classes.inputContainer}>
            <DialogContentText>
              Enter the information below to connect to a remote database
            </DialogContentText>
            {inputInfo.map((info, idx) => (
              <TextField
                key={idx}
                className={classes.textField}
                size="small"
                label={info.label}
                value={info.value}
                onChange={(e) => info.update(e.target.value)}
                variant="outlined"
                type={info.label === "Password" ? "password" : null}
              />
            ))}
          </div>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined" color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              variant="contained"
              color="primary"
              disabled={!(dbName && dbLogin && dbPass && host)}
            >
              Confirm
            </Button>
          </DialogActions>
          <WarningText color="primary">{connErr}</WarningText>
        </DialogContent>
        <Backdrop className={classes.backDrop} open={backDropOpen}>
          <CircularProgress color="primary" />
        </Backdrop>
      </Dialog>
    </div>
  );
}
