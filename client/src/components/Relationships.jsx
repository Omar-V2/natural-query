import React from "react";
import { DatabaseContext } from "../App";
import makeGraph, { getRelations, makeNodeMap, getJoinInfo } from "./Graph";
import {
  makeStyles,
  List,
  ListSubheader,
  Chip,
  IconButton,
  Button,
  TextField,
  Typography,
} from "@material-ui/core";
import cloneDeep from "lodash/cloneDeep";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Graph from "react-graph-vis";
import { RiArrowLeftRightLine } from "react-icons/ri";
import { ArcherContainer, ArcherElement } from "react-archer";
import { deepOrange, grey, blue } from "@material-ui/core/colors";
import { MdEdit } from "react-icons/md";
import axios from "../axios";

const graphCode = {
  nodes: [
    { id: 0, label: "staff", color: "#9e9e9e" },
    { id: 1, label: "classes", color: "#9e9e9e" },
    { id: 2, label: "students", color: "#9e9e9e" },
    { id: 3, label: "societies", color: "#9e9e9e" },
    // { id: 4, label: "enrolments", color: "#9e9e9e" },
  ],
  edges: [
    { id: 0, from: 0, to: 1, label: "" },
    { id: 1, from: 1, to: 4, label: "" },
    { id: 2, from: 2, to: 3, label: "" },
    { id: 3, from: 2, to: 4, label: "" },
  ],
};

const graphSettings = {
  graph: {
    nodes: [
      { id: 0, label: "Student", color: grey[500] },
      { id: 1, label: "Student", color: grey[500] },
      { id: 2, label: "Staff", color: grey[500] },
      { id: 3, label: "Class", color: grey[500] },
      { id: 4, label: "Societies", color: grey[500] },
    ],
    edges: [
      { id: 1, from: 1, to: 3, label: "studies" },
      { id: 2, from: 1, to: 4, label: "participates in" },
      { id: 3, from: 2, to: 3, label: "teaches" },
    ],
  },
  options: {
    physics: {
      enabled: false,
    },
    layout: {
      hierarchical: false,
      randomSeed: 4,
    },
    edges: {
      width: 2.5,
      labelHighlightBold: false,
      color: {
        color: deepOrange[500],
        highlight: blue[500],
      },
      font: {
        color: "#ffffff",
        strokeWidth: 0,
        align: "top",
      },
    },
    height: "300px",
  },
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    color: "primary",
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  iconSpacing: {
    margin: theme.spacing(1),
  },
  iconTextContainer: {
    display: "flex",
    alignItems: "center",
  },
  subHeading: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textField: {
    display: "flex",
    flexDirection: "row",
    width: "50%",
    margin: "auto",
  },
  relationContainer: {
    margin: theme.spacing(1),
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  childRelations: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
}));

export default function Relationships() {
  const classes = useStyles();
  const [currentDb, setCurrentDb] = React.useContext(DatabaseContext);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const editClicked = () => setDialogOpen(true);
  let relations;
  if (Object.keys(currentDb).length !== 0) {
    relations = getRelations(currentDb);
    console.log(JSON.stringify(relations));
  }
  return (
    <React.Fragment>
      <List
        component="nav"
        subheader={
          <div className={classes.subHeading}>
            <ListSubheader className={classes.iconTextContainer}>
              <RiArrowLeftRightLine className={classes.icon} /> Relationships
            </ListSubheader>
            <IconButton
              onClick={() => editClicked()}
              disabled={relations ? false : true}
            >
              <MdEdit />
            </IconButton>
          </div>
        }
      >
        {relations ? (
          relations.map((relation, index) => (
            <Relationship key={index} relation={relation} />
          ))
        ) : (
          <Typography paragraph style={{ margin: 10 }}>
            Connect or select a database and the relationships will appear here!
          </Typography>
        )}
      </List>
      <RelationshipDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        title="Relationship Vocabulary"
      />
    </React.Fragment>
  );
}

function RelationshipDialog({ open, setOpen, title }) {
  const graphOptions = graphSettings.options;
  const [currentDb, setCurrentDb] = React.useContext(DatabaseContext);
  const [nodeMap, setNodeMap] = React.useState();
  const [startGraph, setStartGraph] = React.useState({});
  const [graphData, setGraphData] = React.useState({});

  React.useEffect(() => {
    if (Object.keys(currentDb).length !== 0) {
      const graph = makeGraph(currentDb);
      const nodeMap = makeNodeMap(currentDb, true);
      setNodeMap(nodeMap);
      setStartGraph(graph);
      setGraphData(graph);
    }
  }, [currentDb]);

  const handleClose = () => setOpen(false);
  const handleConfirm = async () => {
    setStartGraph(graphData);
    // console.log(nodeMap);
    const joinInfo = getJoinInfo(graphData, nodeMap);
    try {
      const response = await axios.put("/db", {
        _id: currentDb._id,
        joinInfo: joinInfo,
      });
      setCurrentDb(response.data);
      console.log(response.data);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
      } else if (error.request) {
        console.log(error.request.data);
      }
    }
    setOpen(false);
    console.log(graphData);
    console.log(JSON.stringify(joinInfo));
  };
  const handleCancel = () => {
    setGraphData(startGraph);
    setOpen(false);
  };
  return (
    <div>
      <Dialog open={open} onClose={handleClose} disableBackdropClick>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Define the vocabulary you would like to use when searching across
            multiple tables (joins)
          </DialogContentText>
          <RelationshipGraph
            graphData={graphData}
            graphOptions={graphOptions}
            setGraphData={setGraphData}
          />
          <DialogActions>
            <Button
              onClick={() => handleCancel()}
              variant="outlined"
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleConfirm()}
              variant="contained"
              color="primary"
            >
              Confirm
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RelationshipGraph({ graphData, graphOptions, setGraphData }) {
  const classes = useStyles();
  const [edgeLabel, setEdgeLabel] = React.useState("");
  const [edgeId, setEdgeId] = React.useState();
  const update = (event) => {
    let newGraph = cloneDeep(graphData);
    const { nodes, edges } = event;
    const selected = edges[0];
    for (const edge of newGraph.edges) {
      // check whether an edge alone has been clicked
      if (edge.id === selected && nodes.length === 0) {
        setEdgeLabel(edge.label);
        setEdgeId(edge.id);
      }
    }
  };
  const updateEdgeLabel = () => {
    let newGraph = cloneDeep(graphData);
    for (const edge of newGraph.edges) {
      if (edge.id === edgeId) {
        edge.label = edgeLabel;
      }
    }
    setGraphData(newGraph);
  };
  return (
    <React.Fragment>
      <div className={classes.textField}>
        <TextField
          size="small"
          placeholder="select an edge"
          value={edgeLabel}
          onChange={(e) => setEdgeLabel(e.target.value)}
          variant="outlined"
          className={classes.icon}
        ></TextField>
        <Button variant="contained" color="primary" onClick={updateEdgeLabel}>
          update
        </Button>
      </div>
      <br />
      <Graph
        graph={graphData}
        options={graphOptions}
        events={{ selectEdge: update }}
      />
    </React.Fragment>
  );
}

function Relationship({ relation }) {
  const classes = useStyles();
  const archerRelations = (children) =>
    children.map((child) => ({
      targetId: child.name,
      // label: child.label,
      targetAnchor: "left",
      sourceAnchor: "right",
    }));
  return (
    <React.Fragment>
      <ArcherContainer
        strokeColor={deepOrange[500]}
        offset="10"
        arrowThickness="5"
        arrowLength="5"
      >
        <div className={classes.relationContainer}>
          <ArcherElement
            id={relation.parent}
            relations={archerRelations(relation.children)}
          >
            <Chip label={relation.parent} />
          </ArcherElement>
          <div className={classes.childRelations}>
            {relation.children.map((child, index) => (
              <ArcherElement key={index} id={child.name}>
                <Chip label={child.name} className={classes.iconSpacing} />
              </ArcherElement>
            ))}
          </div>
        </div>
      </ArcherContainer>
    </React.Fragment>
  );
}
