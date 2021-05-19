export function formatFavorites(data) {
  return data.map(f => {

    return {
      name: f.name,
      thumbnailUrl: f.thumbnailUrl,
      numServings: f.numServings,
    };
  });
  
}