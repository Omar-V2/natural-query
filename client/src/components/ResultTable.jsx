import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { TablePagination, withStyles } from "@material-ui/core";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black[1],
  },
  body: {
    fontSize: 24,
  },
}))(TableCell);

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

function createData(name, calories, fat, carbs, protein) {
  return {
    dessert: name,
    calories: calories,
    fat: fat,
    carbs: carbs,
    protein: protein,
  };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const headers = ["Dessert", "Calories", "Fat", "Carbs", "Protein"];

export default function ResultsTable() {
  const classes = useStyles();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <Paper className={classes.root}>
      <TableContainer component={Paper} className={classes.container}>
        <Table stickyHeader className={classes.table} size="small">
          <TableHead>
            <TableRow>
              {headers.map((heading, index) => {
                let align = index === 0 ? "inherit" : "right";
                return (
                  <StyledTableCell key={index} align={align}>
                    {heading}
                  </StyledTableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.calories}</TableCell>
                  <TableCell align="right">{row.fat}</TableCell>
                  <TableCell align="right">{row.carbs}</TableCell>
                  <TableCell align="right">{row.protein}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        rowsPerPage={rowsPerPage}
      />
    </Paper>
  );
}

export function ResultsTableMaterial() {
  const classes = useStyles();
  const columns = headers.map((header) => ({
    title: header,
    field: header.toLowerCase(),
  }));
  return (
    <Paper className={classes.root}>
      <MaterialTable
        columns={columns}
        data={rows}
        options={{
          padding: "dense",
          search: false,
          title: false,
          toolbar: true,
          exportButton: true,
        }}
      ></MaterialTable>
    </Paper>
  );
}
