I am using some logic as attached below for filtering purpose. Please update the codes accordingly preferably cleaned and fully updated - // hybridKeywordMatcher.js const lemmatizer = require("wink-lemmatizer"); /** * Lemmatize a single word */ function lemmatizeWord(word) { return ( lemmatizer.noun(word) || lemmatizer.verb(word) || lemmatizer.adjective(word) || word ); } /** * Process a single string → tokens */ function processString(str) { return str .toLowerCase() .split(/\W+/) .filter(Boolean) .map(lemmatizeWord); } /** * Utility: flexible map (preserves structure) */ function mapFlexible(input, fn) { if (Array.isArray(input)) { if (Array.isArray(input[0])) { return input.map(group => group.map(fn)); // 2D } return input.map(fn); // 1D } return fn(input); // single string } /** * normalizeText * Output preserves structure: * string → tokens[] * string[] → tokens[][] * string[][] → tokens[][][] */ function normalizeText(input) { return mapFlexible(input, processString); } /** * prepareKeywords * Same structure preservation */ function prepareKeywords(keywords) { return mapFlexible(keywords, processString); } /** * Check if keywordTokens exist in token array */ function matchTokens(tokenArray, keywordTokens) { const tokenSet = new Set(tokenArray); return keywordTokens.every(word => tokenSet.has(word)); } /** * calculateScore * Handles: * - tokens: 1D, 2D, or 3D * - keywords: 1D or 2D */ function calculateScore(tokens, keywordTokensList) { let score = 0; // Helper: process one token array function processTokenArray(tokenArray) { if (Array.isArray(keywordTokensList[0])) { // keywords 2D keywordTokensList.forEach(group => { group.forEach(keywordTokens => { if (matchTokens(tokenArray, keywordTokens)) score++; }); }); } else { // keywords 1D keywordTokensList.forEach(keywordTokens => { if (matchTokens(tokenArray, keywordTokens)) score++; }); } } // Detect depth of tokens if (!Array.isArray(tokens[0])) { // 1D → single token array processTokenArray(tokens); } else if (!Array.isArray(tokens[0][0])) { // 2D → array of token arrays tokens.forEach(processTokenArray); } else { // 3D → array of array of token arrays tokens.forEach(group => { group.forEach(processTokenArray); }); } return score; } /** * MAIN FUNCTION * Accepts: * - textArray: string[] OR string[][] OR mixed * - keywords: string[] OR string[][] */ function filterAndScoreText(textArray, keywords) { const keywordTokensList = prepareKeywords(keywords); const results = textArray.map((textItem, index) => { const tokens = normalizeText(textItem); const score = calculateScore(tokens, keywordTokensList); return { index, score, matched: score > 0, text: textItem }; }); return results .filter(item => item.score > 0) .sort((a, b) => b.score - a.score); } module.exports = { filterAndScoreText }; /** * =========================== * ✅ SAMPLE USAGE * =========================== */ /* const data = [ ["Technology is evolving", "AI trends rising"], ["Interest rates increasing", "inflation concerns"], ["Cricket match today"] ]; const keywords = [ ["technology"], ["interest rates"] ]; const result = filterAndScoreText(data, keywords); console.log(JSON.stringify(result, null, 2)); */

#####################

I am using some logic as attached below for filtering purpose. Please update the codes accordingly preferably cleaned and fully updated - 

// hybridKeywordMatcher.js

const lemmatizer = require("wink-lemmatizer");

/**
 * Lemmatize a single word
 */
function lemmatizeWord(word) {
  return (
    lemmatizer.noun(word) ||
    lemmatizer.verb(word) ||
    lemmatizer.adjective(word) ||
    word
  );
}

/**
 * Process a single string → tokens
 */
function processString(str) {
  return str
    .toLowerCase()
    .split(/\W+/)
    .filter(Boolean)
    .map(lemmatizeWord);
}

/**
 * Utility: flexible map (preserves structure)
 */
function mapFlexible(input, fn) {
  if (Array.isArray(input)) {
    if (Array.isArray(input[0])) {
      return input.map(group => group.map(fn)); // 2D
    }
    return input.map(fn); // 1D
  }
  return fn(input); // single string
}

/**
 * normalizeText
 * Output preserves structure:
 * string → tokens[]
 * string[] → tokens[][]
 * string[][] → tokens[][][]
 */
function normalizeText(input) {
  return mapFlexible(input, processString);
}

/**
 * prepareKeywords
 * Same structure preservation
 */
function prepareKeywords(keywords) {
  return mapFlexible(keywords, processString);
}

/**
 * Check if keywordTokens exist in token array
 */
function matchTokens(tokenArray, keywordTokens) {
  const tokenSet = new Set(tokenArray);
  return keywordTokens.every(word => tokenSet.has(word));
}

/**
 * calculateScore
 * Handles:
 * - tokens: 1D, 2D, or 3D
 * - keywords: 1D or 2D
 */
function calculateScore(tokens, keywordTokensList) {
  let score = 0;

  // Helper: process one token array
  function processTokenArray(tokenArray) {
    if (Array.isArray(keywordTokensList[0])) {
      // keywords 2D
      keywordTokensList.forEach(group => {
        group.forEach(keywordTokens => {
          if (matchTokens(tokenArray, keywordTokens)) score++;
        });
      });
    } else {
      // keywords 1D
      keywordTokensList.forEach(keywordTokens => {
        if (matchTokens(tokenArray, keywordTokens)) score++;
      });
    }
  }

  // Detect depth of tokens
  if (!Array.isArray(tokens[0])) {
    // 1D → single token array
    processTokenArray(tokens);
  } else if (!Array.isArray(tokens[0][0])) {
    // 2D → array of token arrays
    tokens.forEach(processTokenArray);
  } else {
    // 3D → array of array of token arrays
    tokens.forEach(group => {
      group.forEach(processTokenArray);
    });
  }

  return score;
}

/**
 * MAIN FUNCTION
 * Accepts:
 * - textArray: string[] OR string[][] OR mixed
 * - keywords: string[] OR string[][]
 */
function filterAndScoreText(textArray, keywords) {
  const keywordTokensList = prepareKeywords(keywords);

  const results = textArray.map((textItem, index) => {
    const tokens = normalizeText(textItem);
    const score = calculateScore(tokens, keywordTokensList);

    return {
      index,
      score,
      matched: score > 0,
      text: textItem
    };
  });

  return results
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);
}

module.exports = {
  filterAndScoreText
};

/**
 * ===========================
 * ✅ SAMPLE USAGE
 * ===========================
 */

/*
const data = [
  ["Technology is evolving", "AI trends rising"],
  ["Interest rates increasing", "inflation concerns"],
  ["Cricket match today"]
];

const keywords = [
  ["technology"],
  ["interest rates"]
];

const result = filterAndScoreText(data, keywords);

console.log(JSON.stringify(result, null, 2));
*/
