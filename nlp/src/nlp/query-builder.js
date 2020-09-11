const express = require("express");
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
      await handleNew(token, tokens, queryTemplate);
    } else {
      handleKnown(token, queryTemplate);
    }
  }
};

const getLastColumn = (tokens, startIndex) => {
  for (let i = startIndex; i >= 0; i--) {
    currentToken = tokens[i];
    console.log(currentToken);
    if (currentToken.metaData && currentToken.metaData.type === "column") {
      console.log("returned", currentToken);
      return currentToken;
    }
  }
};

const handleNew = async (token, tokens, queryTemplate) => {
  // greater than - less than will cuase bug here
  if (token.value.startsWith("*")) {
    handleColumnValue(token, tokens, queryTemplate);
  } else {
    const response = await parseNLP(token.value);
    if (response.answer) {
      queryTemplate.select.type = response.answer;
    }
  }
};

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

const handleColumnValue = (token, tokens, queryTemplate) => {
  console.log("column value handler triggered");
  const startIndex = token.index;
  const parentColumn = getLastColumn(tokens, startIndex);
  const table = parentColumn.metaData.table;
  const column = parentColumn.metaData.value;
  const condition = {
    column: `${table}.${column}`,
    operator: "=",
    value: `'${token.value.substr(1)}'`,
  };
  queryTemplate.where.conditions.push(condition);
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
  where: {
    conditions: [],
  },
};

const getTemplate = () => ({
  select: {
    columns: new Set(["*"]), // delete "*" when adding new columns
    type: "",
  },
  from: {
    tables: new Set(),
  },
  where: {
    conditions: [],
  },
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
