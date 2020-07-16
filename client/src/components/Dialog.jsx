import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  inputContainer: {
    display: "flex",
    flexDirection: "column",
  },
  mainContainer: {
    display: "flex",
    flexDirection: "row",
  },
  textField: {
    margin: theme.spacing(1),
  },
}));

export default function FormDialog({ title, open, setOpen }) {
  const classes = useStyles();

  const [host, setHost] = React.useState("");
  const [dbName, setDbName] = React.useState("");
  const [dbLogin, setDbLogin] = React.useState("");
  const [dbPass, setDbPass] = React.useState("");

  const inputInfo = [
    { label: "Host URL", value: host, update: setHost },
    { label: "Database Name", value: dbName, update: setDbName },
    { label: "Login", value: dbLogin, update: setDbLogin },
    { label: "Password", value: dbPass, update: setDbPass },
  ];

  const handleClose = () => setOpen(false);

  return (
    <div>
      <Dialog open={open} onClose={handleClose} disableBackdropClick>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {/* <div className={classes.mainContainer}> */}
          <div className={classes.inputContainer}>
            <DialogContentText>
              Enter the information below to connect to a remote database
            </DialogContentText>
            {inputInfo.map((info, idx) => (
              <React.Fragment>
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
              </React.Fragment>
            ))}
          </div>
          {/* </div> */}
          <DialogActions>
            <Button onClick={handleClose} variant="outlined" color="primary">
              Cancel
            </Button>
            <Button onClick={handleClose} variant="outlined" color="primary">
              Confirm
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
