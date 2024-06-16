const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const cosineSimilarity = require('compute-cosine-similarity');
const heapq = require('heapq');

const recipes = [];
const recipesIndex = {};

// Read recipes CSV file
fs.createReadStream(path.join(__dirname, '../models/recipes_dataset.csv'))
  .pipe(csv())
  .on('data', (row) => {
    recipes.push(row);
  })
  .on('end', () => {
    console.log('Recipes CSV file successfully processed');
    recipes.forEach((recipe, index) => {
      recipesIndex[recipe.recipeId] = index;
    });
  });

const tokenize = (text) => text.split(',');
const vectorize = (ingredients) => {
  const ingredientList = ingredients.map(tokenize);
  const uniqueIngredients = [...new Set(ingredientList.flat())];
  return ingredientList.map((row) =>
    uniqueIngredients.map((ingredient) =>
      row.includes(ingredient) ? 1 : 0
    )
  );
};

class ContentKNNAlgorithm {
  constructor(k = 40) {
    this.k = k;
  }

  fit(trainset) {
    this.trainset = trainset;

    console.log("Computing content-based similarity matrix...");

    // Compute content similarity for every recipe combination
    this.similarities = Array.from({ length: this.trainset.n_items }, () =>
      Array(this.trainset.n_items).fill(0)
    );
    for (let thisRating = 0; thisRating < this.trainset.n_items; thisRating++) {
      if (thisRating % 100 === 0) {
        console.log(`${thisRating} of ${this.trainset.n_items}`);
      }
      for (let otherRating = thisRating + 1; otherRating < this.trainset.n_items; otherRating++) {
        let thisRecipeID = parseInt(this.trainset.to_raw_iid(thisRating));
        let otherRecipeID = parseInt(this.trainset.to_raw_iid(otherRating));
        let similarity = this.computeContentSimilarity(thisRecipeID, otherRecipeID);
        this.similarities[thisRating][otherRating] = similarity;
        this.similarities[otherRating][thisRating] = similarity;
      }
    }

    console.log("...done.");

    return this;
  }

  computeContentSimilarity(recipe1_id, recipe2_id) {
    let recipe1 = recipes[recipesIndex[recipe1_id]];
    let recipe2 = recipes[recipesIndex[recipe2_id]];

    // Compute ingredient similarity
    let ingredient_vector_1 = vectorize([recipe1.Ingredients])[0];
    let ingredient_vector_2 = vectorize([recipe2.Ingredients])[0];
    let ingredient_similarity = cosineSimilarity(ingredient_vector_1, ingredient_vector_2);

    // Compute similarity based on category
    let category_similarity = recipe1.Category === recipe2.Category ? 1 : 0;

    // Compute similarity based on total time
    let time_diff = Math.abs(parseInt(recipe1['Total Time']) - parseInt(recipe2['Total Time']));
    let time_similarity = Math.exp(-time_diff / 10.0);

    // Combine similarities (adjust weights as necessary)
    let combined_similarity = 0.2 * ingredient_similarity + 0.6 * category_similarity + 0.2 * time_similarity;

    return combined_similarity;
  }

  estimate(u, i) {
    if (!this.trainset.knows_user(u) || !this.trainset.knows_item(i)) {
      throw new Error('PredictionImpossible: User and/or item is unknown.');
    }

    // Build up similarity scores between this item and everything the user rated
    let neighbors = [];
    this.trainset.ur[u].forEach((rating) => {
      let content_similarity = this.similarities[i][rating[0]];
      neighbors.push([content_similarity, rating[1]]);
    });

    // Extract the top-K most-similar ratings
    let k_neighbors = heapq.nlargest(neighbors, this.k, (t) => t[0]);

    if (!k_neighbors.length) {
      throw new Error('PredictionImpossible: No neighbors');
    }

    // Compute average sim score of K neighbors weighted by user ratings
    let simTotal = 0, weightedSum = 0;
    k_neighbors.forEach(([simScore, rating]) => {
      if (simScore > 0) {
        simTotal += simScore;
        weightedSum += simScore * rating;
      }
    });

    if (simTotal === 0) {
      throw new Error('PredictionImpossible: No neighbors');
    }

    let predictedRating = weightedSum / simTotal;

    return predictedRating;
  }
}

module.exports = { ContentKNNAlgorithm };
