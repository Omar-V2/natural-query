import React from "react";
import CreatableSelect from "react-select/creatable";
import { makeStyles } from "@material-ui/core";
import { DatabaseContext } from "../App";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    // maxWidth: "75%",
    // margin: "auto",
  },
}));

const customStyles = {
  option: (provided) => ({
    ...provided,
    color: "black",
  }),
  control: (provided) => ({
    ...provided,
    color: "black",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "black",
  }),
};

const getTableOptions = (currentDb) => {
  const tables = currentDb.tables.map((table) => ({
    label: table.name,
    value: table.name,
    metaData: { type: "table", value: table.name },
  }));
  return tables;
};

const getColumnOptions = (currentDb) => {
  const options = [];
  for (const table of currentDb.tables) {
    for (const col of table.columns) {
      const label = `${col.name} of ${table.name}`;
      options.push({
        label: label,
        value: `${col.name}.${table.name}`,
        metaData: { type: "column", table: table.name, value: col.name },
      });
    }
  }
  return options;
};

const getKeyWordOptions = (currentDb) => {
  const options = [];
  for (const table of currentDb.tables) {
    for (const rel of table.relationships) {
      const option = {
        label: rel.identifier,
        value: `${rel.identifier}.${table.name}`,
        metaData: { ...rel },
      };
      options.push(option);
    }
  }
  return options;
};

export default function Search() {
  const [optionsValues, setOptionsValues] = React.useState();
  const [currentDb, setCurrentDb] = React.useContext(DatabaseContext);
  const classes = useStyles();
  let tables = [];
  let columns = [];
  let keyWords = [];
  if (Object.keys(currentDb).length > 0) {
    tables = getTableOptions(currentDb);
    columns = getColumnOptions(currentDb);
    keyWords = getKeyWordOptions(currentDb);
  }
  const groupedOptions = [
    {
      label: "Tables",
      options: tables,
    },
    {
      label: "Columns",
      options: columns,
    },
    {
      label: "Join Key-words",
      options: keyWords,
    },
  ];
  return (
    <>
      <CreatableSelect
        options={groupedOptions}
        className={classes.root}
        value={optionsValues}
        onChange={setOptionsValues}
        isMulti
        hideSelectedOptions={false}
        styles={customStyles}
      />
      {JSON.stringify(optionsValues)}
    </>
  );
}
