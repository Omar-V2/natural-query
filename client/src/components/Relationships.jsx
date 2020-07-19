import React from "react";
import {
  makeStyles,
  List,
  ListSubheader,
  Chip,
  IconButton,
} from "@material-ui/core";
import { RiArrowLeftRightLine } from "react-icons/ri";
import { ArcherContainer, ArcherElement } from "react-archer";
import { deepOrange } from "@material-ui/core/colors";
import { MdEdit } from "react-icons/md";

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
  const relations = [
    {
      parent: "Students",
      children: [
        { name: "Class", label: null },
        { name: "Staff", label: null },
        { name: "Societies", label: null },
      ],
    },
    {
      parent: "Class",
      children: [
        { name: "Student", label: null },
        { name: "Staff", label: null },
      ],
    },
    { parent: "Societies", children: [{ name: "Students", label: null }] },
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
            <IconButton>
              <MdEdit />
            </IconButton>
          </div>
        }
      >
        {relations.map((relation, index) => (
          <Relationship key={index} relation={relation} />
        ))}
      </List>
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
    <div className={classes.mainContainer}>
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
    </div>
  );
}
