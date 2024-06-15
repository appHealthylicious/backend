const fs = require('fs');
const path = require('path');

let recipeData = [];

// Muat data resep dari file JSON
const loadRecipeData = () => {
  fs.readFile(path.join(__dirname, '../../models/recipesData.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading recipeData.json:', err);
      return;
    }
    recipeData = JSON.parse(data);
    console.log('Recipe data JSON file successfully processed');
  });
};

// Panggil fungsi ini saat aplikasi dimulai
loadRecipeData();

// Fungsi untuk mendapatkan rekomendasi berdasarkan kategori
const getRecommendations = (categories, limit = 5) => {
  const recommendations = {};

  categories.forEach(category => {
    recommendations[category] = recipeData
      .filter(recipe => recipe.category && recipe.category.toLowerCase().includes(category.toLowerCase()))
      .slice(0, limit);
  });

  // Tambahkan kategori "Easy to Make"
  recommendations["easy_to_make"] = recipeData
    .filter(recipe => {
      const totalIngredients = recipe.ingredient_groups.reduce((count, group) => count + group.ingredients.length, 0);
      return totalIngredients < 7;
    })
    .slice(0, limit);

  // Tambahkan kategori "Quick to Cook"
  recommendations["quick_to_cook"] = recipeData
    .filter(recipe => recipe.total_time < 30)
    .slice(0, limit);

  return recommendations;
};

module.exports = { loadRecipeData, getRecommendations };
