const { NlpManager } = require("node-nlp");

const manager = new NlpManager({
  languages: ["en"],
  nlu: { useNoneFeature: false },
});
// Adds the utterances and intents for the NLP
// Count
manager.addDocument("en", "How many", "query.select.count");
manager.addDocument("en", "Number of", "query.select.count");
manager.addDocument("en", "Count", "query.select.count");

// Sum

//Average
manager.addDocument("en", "Average", "query.select.average");
manager.addDocument("en", "Mean", "query.select.average");

//Min
manager.addDocument("en", "Minimum", "query.select.min");
manager.addDocument("en", "Min", "query.select.min");
manager.addDocument("en", "Least", "query.select.min");
manager.addDocument("en", "Lowest", "query.select.min");
manager.addDocument("en", "Smallest", "query.select.min");

//Max
manager.addDocument("en", "Maximum", "query.select.max");
manager.addDocument("en", "Max", "query.select.max");
manager.addDocument("en", "Biggest", "query.select.max");
manager.addDocument("en", "Largest", "query.select.max");
manager.addDocument("en", "Greatest", "query.select.max");

// Operator - greater than
manager.addDocument("en", "greater than", "query.operator.gt");
manager.addDocument("en", "larger than", "query.operator.gt");
manager.addDocument("en", "bigger than", "query.operator.get");
manager.addDocument("en", "more than", "query.operator.gt");
manager.addDocument("en", "over", "query.operator.gt");

// Operator - less than
manager.addDocument("en", "less than", "query.operator.lt");
manager.addDocument("en", "lesser than", "query.operator.lt");
manager.addDocument("en", "smaller than", "query.operator.lt");
manager.addDocument("en", "below", "query.operator.lt");
manager.addDocument("en", "under", "query.operator.lt");

// manager.addNamedEntityText("hero", "spiderman", ["en"], ["spiderman"]);

// Train also the NLG
manager.addAnswer("en", "query.select.count", "COUNT");
manager.addAnswer("en", "query.select.average", "AVG");
manager.addAnswer("en", "query.select.min", "MIN");
manager.addAnswer("en", "query.select.max", "MAX");

// Train and save the model.
const parseNLP = async (inputString) => {
  await manager.train();
  manager.save();
  const response = await manager.process("en", inputString);
  return response;
  // console.log(`Intent is: ${response.intent}`);
  // console.log(response);
};

// parseNLP("min");
module.exports = parseNLP;
