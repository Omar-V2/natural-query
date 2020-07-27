import React from "react";
import Select from "react-select";
import { makeStyles } from "@material-ui/core";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    // maxWidth: "75%",
    // margin: "auto",
  },
}));

export default function Search() {
  const classes = useStyles();
  return <Select options={options} className={classes.root} />;
}
