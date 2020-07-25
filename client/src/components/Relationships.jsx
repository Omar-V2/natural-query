import React from "react";
import {
  makeStyles,
  List,
  ListSubheader,
  Chip,
  IconButton,
  Button,
  TextField,
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

const graphSettings = {
  graph: {
    nodes: [
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
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const editClicked = () => setDialogOpen(true);
  const relations = [
    {
      parent: "Students",
      children: [{ name: "Class" }, { name: "Societies" }],
    },
    {
      parent: "Staff",
      children: [{ name: "Class" }],
    },
  ];
  return (
    <React.Fragment>
      <List
        component="nav"
        subheader={
          <div className={classes.subHeading}>
            <ListSubheader className={classes.iconTextContainer}>
              <RiArrowLeftRightLine className={classes.icon} /> Relationships
            </ListSubheader>
            <IconButton onClick={editClicked}>
              <MdEdit />
            </IconButton>
          </div>
        }
      >
        {relations.map((relation, index) => (
          <Relationship key={index} relation={relation} />
        ))}
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
  const initialGraphData = graphSettings.graph;
  const graphOptions = graphSettings.options;
  const [startGraph, setStartGraph] = React.useState(initialGraphData);
  const [graphData, setGraphData] = React.useState(initialGraphData);
  const handleClose = () => setOpen(false);
  const handleConfirm = () => {
    setStartGraph(graphData);
    setOpen(false);
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
            <Button onClick={handleCancel} variant="outlined" color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirm} variant="contained" color="primary">
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
      label: child.label,
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
