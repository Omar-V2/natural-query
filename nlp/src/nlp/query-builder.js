const express = require("express");
const parseNlp = require("./index");
const parseNLP = require("./index");

const router = express.Router();

router.post("/", async (req, res) => {
  const tokens = req.body.tokens;
  const template = getTemplate();
  await processTokens(tokens, template);
  const query = buildQuery(template);
  console.log(query);
  res.json({
    query: query,
  });
});

const processTokens = async (tokens, queryTemplate) => {
  for (let token of tokens) {
    if (token.__isNew__) {
      await handleNew(token, queryTemplate);
    } else {
      handleKnown(token, queryTemplate);
    }
  }
};

const handleNew = async (token, queryTemplate) => {
  // greater than - less than will cuase bug here
  const response = await parseNLP(token.value);
  console.log(response);
  // if (response.entities.length > 0) {
  // }
  queryTemplate.select.type = response.answer;
  // console.log(queryTemplate);
  // classifyColumn(token.value)
};

const classifyIntent = (token, queryTemplate) => {};

const handleKnown = (token, queryTemplate) => {
  switch (token.metaData.type) {
    case "table":
      handleTable(token, queryTemplate);
      break;
    case "column":
      handleColumn(token, queryTemplate);
      break;
    case "join":
      handleJoin(token, queryTemplate);
      break;
    case "operator":
      hanldeOperator(token, queryTemplate);
      break;
  }
};

const handleTable = (token, queryTemplate) => {
  console.log("table handler triggered");
  queryTemplate.from.tables.add(token.metaData.value);
};

const handleColumn = (token, queryTemplate) => {
  console.log("column handler triggered");
  // clear the default "*" from the columns set
  if (queryTemplate.select.columns.has("*")) {
    queryTemplate.select.columns.clear();
  }
  const table = token.metaData.table;
  const column = token.metaData.value;
  queryTemplate.from.tables.add(table);
  queryTemplate.select.columns.add(`${table}.${column}`);
};

const handleJoin = (token, queryTemplate) => {
  console.log("join handler triggered");
  const parentTable = token.metaData.parentTable;
  const foreignTable = token.metaData.table;
  const parentColumn = token.metaData["parent column"];
  const foreignColumn = token.metaData["foreign column"];
  const joinCondition = {
    column: `${parentTable}.${parentColumn}`,
    operator: "=",
    value: `${foreignTable}.${foreignColumn}`,
  };
  queryTemplate.from.tables.add(parentTable);
  queryTemplate.from.tables.add(foreignTable);
  queryTemplate.where.conditions.push(joinCondition);
};

const hanldeOperator = (token, queryTemplate) => {
  console.log("operator handler triggered");
  const operator = token.value;
  queryTemplate.where.conditions.push({ operator: operator });
};

const buildSelect = (select) => {
  const columnsArray = Array.from(select.columns);
  const columns = columnsArray.join(", ");
  if (select.type) {
    return `SELECT ${select.type}(${columns})`;
  }
  return `SELECT ${columns}`;
};

const buildFrom = (from) => {
  let tablesArray = Array.from(from.tables);
  const tables = tablesArray.join(", ");
  return `FROM ${tables}`;
};

const buildWhere = (where) => {
  let query = where.conditions.length > 0 ? "WHERE " : null;
  for (const cond of where.conditions) {
    if (cond.column) {
      query += `${cond.column} ${cond.operator} ${cond.value}`;
    } else {
      query += ` ${cond.operator} `;
    }
  }
  return query;
};

const buildQuery = (template) => {
  let query = [
    buildSelect(template.select),
    buildFrom(template.from),
    buildWhere(template.where),
  ]
    .join("\n")
    .trim();

  query += ";";
  return query;
};

const queryTemplate = {
  select: {
    columns: new Set(["*"]), // delete "*" when adding new columns
    type: "",
  },
  from: {
    tables: new Set(),
  },
  join: false,
  where: {
    conditions: [],
  },
  group_by: {},
  order_by: {},
};

const getTemplate = () => ({
  select: {
    columns: new Set(["*"]), // delete "*" when adding new columns
    type: "",
  },
  from: {
    tables: new Set(),
  },
  join: false,
  where: {
    conditions: [],
  },
  group_by: {},
  order_by: {},
});

const query = {
  select: {
    column: "age",
    type: "AVG",
  },
  from: {
    table: "student",
  },
  join: {},
  where: {
    conditions: [
      { column: "name", operator: "=", value: "Doe" },
      {
        operator: "OR",
      },
      { column: "age", operator: ">", value: "25" },
    ],
  },
  group_by: {},
  order_by: {},
};

module.exports = router;