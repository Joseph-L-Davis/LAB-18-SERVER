export function formatRecipes(data) {
  
  const filteredArr = data.results.map(item => {
    return item.recipes;
  }).filter(arr => arr);
  return filteredArr[0].map(item => {
    return {
      name: item.name,
      thumbnail_url: item.thumbnail_url,
      num_servings: item.num_servings,
    };
  });
}