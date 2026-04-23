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


ANSWER - 

####################

Nice—this is already a solid hybrid matcher 👍
What you need now is to **plug this into your data pipeline properly** and extend it slightly so it works for:

* Macro filtering
* Company filtering
* Sector filtering
* Efficient extractor feeding

I’ll give you a **cleaned + upgraded version** and show exactly **where it fits in your pipeline**.

---

# 🧠 What we’ll improve

Your current code:

* ✅ Good normalization
* ✅ Flexible structure
* ❌ No category separation (macro vs company vs sector)
* ❌ No threshold control
* ❌ No direct integration with pipeline

---

# 🔥 Updated Version (Production-ready for your use case)

### ✅ Key additions:

* Category-based filtering (macro / company / sector)
* Threshold-based selection
* Cleaner API
* Direct compatibility with extractor pipeline

---

## ✅ Updated Code

```js
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
 * Process string → tokens
 */
function processString(str = "") {
  return str
    .toLowerCase()
    .split(/\W+/)
    .filter(Boolean)
    .map(lemmatizeWord);
}

/**
 * Flexible mapper (1D / 2D safe)
 */
function mapFlexible(input, fn) {
  if (Array.isArray(input)) {
    if (Array.isArray(input[0])) {
      return input.map(group => group.map(fn));
    }
    return input.map(fn);
  }
  return fn(input);
}

/**
 * Normalize text
 */
function normalizeText(input) {
  return mapFlexible(input, processString);
}

/**
 * Prepare keywords
 */
function prepareKeywords(keywords) {
  return mapFlexible(keywords, processString);
}

/**
 * Match tokens
 */
function matchTokens(tokenArray, keywordTokens) {
  const tokenSet = new Set(tokenArray);
  return keywordTokens.every(word => tokenSet.has(word));
}

/**
 * Calculate score
 */
function calculateScore(tokens, keywordTokensList) {
  let score = 0;

  function processTokenArray(tokenArray) {
    if (Array.isArray(keywordTokensList[0])) {
      keywordTokensList.forEach(group => {
        group.forEach(keywordTokens => {
          if (matchTokens(tokenArray, keywordTokens)) score++;
        });
      });
    } else {
      keywordTokensList.forEach(keywordTokens => {
        if (matchTokens(tokenArray, keywordTokens)) score++;
      });
    }
  }

  if (!Array.isArray(tokens[0])) {
    processTokenArray(tokens);
  } else if (!Array.isArray(tokens[0][0])) {
    tokens.forEach(processTokenArray);
  } else {
    tokens.forEach(group => group.forEach(processTokenArray));
  }

  return score;
}

/**
 * MAIN FILTER FUNCTION (ENHANCED)
 */
function filterRelevantData({
  data = [],
  macroKeywords = [],
  companyKeywords = [],
  sectorKeywords = [],
  minScore = 1
}) {
  const macroTokens = prepareKeywords(macroKeywords);
  const companyTokens = prepareKeywords(companyKeywords);
  const sectorTokens = prepareKeywords(sectorKeywords);

  const results = data.map((item, index) => {
    const text = `${item.title || ""} ${item.summary || item.text || ""}`;
    const tokens = normalizeText(text);

    const macroScore = calculateScore(tokens, macroTokens);
    const companyScore = calculateScore(tokens, companyTokens);
    const sectorScore = calculateScore(tokens, sectorTokens);

    const totalScore = macroScore + companyScore + sectorScore;

    return {
      index,
      text,
      original: item,
      scores: {
        macro: macroScore,
        company: companyScore,
        sector: sectorScore,
        total: totalScore
      },
      matched: totalScore >= minScore
    };
  });

  return results
    .filter(r => r.matched)
    .sort((a, b) => b.scores.total - a.scores.total);
}

module.exports = {
  filterRelevantData
};
```

---

# ⚡ How to use this in YOUR pipeline

---

## 🟢 Step 1: Define keywords dynamically

```js
const macroKeywords = [
  ["interest rate", "inflation", "fed", "bond yield", "cpi"],
  ["oil price", "crude", "usd", "dollar"]
];

const companyKeywords = portfolio.map(p => [p.symbol.toLowerCase()]);

const sectorKeywords = [
  ["technology", "it"],
  ["banking"],
  ["energy"],
  ["pharma"]
];
```

---

## 🟡 Step 2: Filter API data BEFORE extractor

```js
const filteredNews = filterRelevantData({
  data: newsAPIResponse,
  macroKeywords,
  companyKeywords,
  sectorKeywords,
  minScore: 1
});
```

---

## 🔵 Step 3: Feed ONLY filtered data to extractor

```js
const extractorInputs = filteredNews.map(item => ({
  text: item.text,
  metadata: item.scores
}));
```

---

## 🔥 Step 4: Extract events

```js
for (let item of extractorInputs) {
  await extractEvent(item.text);
}
```

---

# 🧠 Why this version is better

---

## ✅ 1. Multi-dimensional relevance

You now detect:

* Macro relevance
* Company relevance
* Sector relevance

---

## ✅ 2. Scoring-based filtering

Not binary:

* More flexible
* More accurate

---

## ✅ 3. Token optimization

You now:

* Send only relevant text
* Avoid noise
* Reduce LLM calls drastically

---

## ✅ 4. Works perfectly with causal engine

Because now each item has:

```js
scores: {
  macro: 2,
  company: 1,
  sector: 1
}
```

👉 You can later use this for:

* weighting causes
* prioritizing explanations

---

# ⚠️ Optional improvement (very useful)

Add **top-K filtering**

```js
const topFiltered = filteredNews.slice(0, 10);
```

👉 Guarantees:

* bounded LLM cost

---

# 🏆 Final takeaway

> Your matcher is now not just a filter—it’s a **relevance engine for causal intelligence**

---

# 👉 Next step

We can now:

* Plug this into your **full pipeline code**
* Improve **keyword generation dynamically**
* Or connect this with your **causal scoring system**

Just tell me 👍

