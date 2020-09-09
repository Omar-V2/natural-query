import React from "react";
import CreatableSelect from "react-select/creatable";
import SyntaxHighlighter from "react-syntax-highlighter";
import { makeStyles, Button, Typography } from "@material-ui/core";
import { DatabaseContext } from "../App";
import { axiosNLP } from "../axios";
import { QueryContext } from "../Main";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "75%",
    margin: "auto",
  },
  searchBar: {
    width: "100%",
    marginRight: theme.spacing(3),
  },
  barButtonContainer: {
    display: "flex",
    flexDirection: "row",
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
        metaData: { type: "join", parentTable: table.name, ...rel },
      };
      options.push(option);
    }
  }
  return options;
};

const getLogicalOperators = () => {
  const andOperator = {
    label: "and",
    value: "AND",
    metaData: { type: "operator", value: "AND" },
  };
  const orOperator = {
    label: "or",
    value: "OR",
    metaData: { type: "operator", value: "OR" },
  };
  const notOperator = {
    label: "not",
    value: "NOT",
    metaData: { type: "operator", value: "NOT" },
  };
  return [andOperator, orOperator, notOperator];
};

const checkIdentifiersFilled = (currentDb) => {
  for (let table of currentDb.tables) {
    for (let rel of table.relationships) {
      if (rel.identifier === "") {
        return false;
      }
    }
  }
  return true;
};

export default function Search() {
  const [optionsValues, setOptionsValues] = React.useState();
  const [currentDb, setCurrentDb] = React.useContext(DatabaseContext);
  const [fullOptions, setFullOptions] = React.useState([]);
  const [query, setQuery] = React.useContext(QueryContext);
  const classes = useStyles();
  let tables = [];
  let columns = [];
  let keyWords = [];
  let logicalOperators = [];
  React.useEffect(() => {
    if (Object.keys(currentDb).length > 0) {
      tables = getTableOptions(currentDb);
      columns = getColumnOptions(currentDb);
      keyWords = getKeyWordOptions(currentDb);
      logicalOperators = getLogicalOperators();
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
        {
          label: "logical operators",
          options: logicalOperators,
        },
      ];
      if (checkIdentifiersFilled(currentDb)) {
        setFullOptions(groupedOptions);
      } else {
        setFullOptions([]);
      }
    }
  }, [currentDb]);

  const handleLabel = (option) => {
    // use same idea here for word embeddings feature but with ":" instead of "*"
    const label = option.label.startsWith("*")
      ? option.label.substr(1)
      : option.label;
    return label;
  };

  const handleSubmit = async () => {
    const optionsWithIndexes = optionsValues.map((option, index) => ({
      ...option,
      index: index,
    }));
    try {
      const response = await axiosNLP.post("/nlp", {
        tokens: optionsWithIndexes,
      });
      const queryFromResponse = response.data.query;
      setQuery(queryFromResponse);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // const groupedOptions = [
  //   {
  //     label: "Tables",
  //     options: tables,
  //   },
  //   {
  //     label: "Columns",
  //     options: columns,
  //   },
  //   {
  //     label: "Join Key-words",
  //     options: keyWords,
  //   },
  //   {
  //     label: "logical operators",
  //     options: logicalOperators,
  //   },
  // ];

  return (
    <div className={classes.root}>
      <div className={classes.barButtonContainer}>
        <CreatableSelect
          className={classes.searchBar}
          options={fullOptions}
          noOptionsMessage={() =>
            "Connect or select a database to start querying!\n Make sure to complete the relationships section too!"
          }
          value={optionsValues}
          onChange={setOptionsValues}
          isMulti
          isOptionSelected={(option, selectValue) =>
            selectValue.some((i) => i === option)
          }
          getOptionLabel={handleLabel}
          hideSelectedOptions={false}
          styles={customStyles}
        />
        <Button
          variant="outlined"
          color="primary"
          disabled={
            optionsValues === null ||
            optionsValues === undefined ||
            (optionsValues && optionsValues.length === 0)
          }
          onClick={() => handleSubmit()}
        >
          Go
        </Button>
      </div>
      <div>{JSON.stringify(optionsValues)}</div>
      {query ? (
        <div>
          <br />
          <Typography>Generated SQL</Typography>
          <SyntaxHighlighter language="sql" style={a11yDark}>
            {query}
          </SyntaxHighlighter>
        </div>
      ) : null}
    </div>
  );
}
