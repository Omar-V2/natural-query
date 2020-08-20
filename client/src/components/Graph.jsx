import { grey } from "@material-ui/core/colors";

export default function makeGraph(currentDb) {
  let relations = getRelations(currentDb);
  const nodes = getNodes(currentDb);
  const nodeMap = makeNodeMap(currentDb);
  const edges = getEdges(relations, nodeMap);
  return { nodes: nodes, edges: edges };
}

export function getRelations(currentDb) {
  let relations = [];
  for (let table of currentDb.tables) {
    const parent = table.name;
    let children = [];
    for (let rel of table.relationships) {
      children.push({ name: rel.table, label: rel.identifier });
    }
    // only show entities that actually have children
    if (children.length > 0) {
      relations.push({ parent: parent, children: children });
    }
  }
  return relations;
}

export function makeNodeMap(currentDb, inverse = false) {
  let nodeMap = new Map();
  const tables = currentDb.tables;
  for (let i = 0; i < tables.length; i++) {
    const tableName = tables[i].name;
    inverse ? nodeMap.set(i, tableName) : nodeMap.set(tableName, i);
  }
  return nodeMap;
}

function getNodes(currentDb) {
  const tables = currentDb.tables;
  const nodes = [];
  for (let i = 0; i < tables.length; i++) {
    const tableName = tables[i].name;
    nodes.push({ id: i, label: tableName, color: grey[500] });
  }
  return nodes;
}

function getEdges(rels, nodeMap) {
  const edges = [];
  let count = 0;
  for (const rel of rels) {
    const from_id = nodeMap.get(rel.parent);
    for (let child of rel.children) {
      const to_id = nodeMap.get(child.name);
      edges.push({ id: count, from: from_id, to: to_id, label: child.label });
      count++;
    }
  }
  return edges;
}

export function getJoinInfo(graph, nodeMap) {
  const edges = graph.edges;
  // console.log("nodeMap");
  console.log(nodeMap);
  console.log(edges);
  const info = edges.map((edge) => ({
    parentTable: nodeMap.get(edge.from),
    foreignTable: nodeMap.get(edge.to),
    label: edge.label,
  }));
  console.log(info);
  return info;
}
