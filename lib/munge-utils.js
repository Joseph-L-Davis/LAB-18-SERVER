export function formatFavorites(data) {
  return data.map(f => {

    return {
      name: f.name,
      thumbnail_url: f.thumbnail_url,
      num_servings: f.num_servings,
    };
  });
  
}