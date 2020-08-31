import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import Paper from "@material-ui/core/Paper";
import axios from "../axios";
import { QueryContext } from "../Main";
import { DatabaseContext } from "../App";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 350,
    minHeight: 350,
  },
  table: {
    minWidth: 650,
  },
});

export default function ResultsTableMaterial() {
  const classes = useStyles();
  const [currentDb, setCurrentDb] = React.useContext(DatabaseContext);
  const [query, setQuery] = React.useContext(QueryContext);
  const [tableData, setTableData] = React.useState([]);
  const [tableColumns, setTableColumns] = React.useState([]);

  React.useEffect(() => {
    const getData = async (queryString) => {
      const response = await axios.post("/query", {
        dbname: currentDb.database,
        host: currentDb.host,
        user: currentDb.user,
        query: queryString,
      });
      const data = response.data;
      setTableColumns(data.columns);
      setTableData(data.data);
      console.log(data.data);
    };
    if (query) {
      getData(query);
    }
  }, [query]);

  const makeColumns = (columns) =>
    columns.map((column) => ({ title: column, field: column }));

  return (
    <Paper className={classes.root}>
      <MaterialTable
        columns={makeColumns(tableColumns)}
        data={tableData}
        // title={`Query returned ${tableData.length} results`}
        title={query}
        localization={{
          body: { emptyDataSourceMessage: "Query results will appear here." },
        }}
        options={{
          padding: "dense",
          search: true,
          title: false,
          toolbar: true,
          exportButton: true,
        }}
      ></MaterialTable>
    </Paper>
  );
}
