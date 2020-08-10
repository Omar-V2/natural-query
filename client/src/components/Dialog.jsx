import React from "react";
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
}));

const WarningText = withStyles({
  root: {
    color: red[500],
  },
})(Typography);

export default function FormDialog({ title, open, setOpen }) {
  const classes = useStyles();

  const [host, setHost] = React.useState("");
  const [dbName, setDbName] = React.useState("");
  const [dbLogin, setDbLogin] = React.useState("");
  const [dbPass, setDbPass] = React.useState("");
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
      setConnErr("");
      // also close dialog upon successful connection
    } catch (error) {
      console.log(error.response.data);
      const errorMessage = error.response.data.message;
      setConnErr(errorMessage);
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
            <Button onClick={handleConfirm} variant="contained" color="primary">
              Confirm
            </Button>
          </DialogActions>
          <WarningText color="primary">{connErr}</WarningText>
        </DialogContent>
        {/* <Backdrop open={backDropOpen}>
          <CircularProgress color="primary" />
        </Backdrop> */}
      </Dialog>
    </div>
  );
}
