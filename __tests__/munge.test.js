import recipes from '../data/recipes.js';
import { formatRecipes } from '../lib/munge-utils';

describe('API Data Munging', () => {

  const expectedFavorites = [
    {
      name: 'Tomato Shorba',
      thumbnail_url: 'https://img.buzzfeed.com/tasty-app-user-assets-prod-us-east-1/recipes/89513629797746a39d5e6d688a87d7d9.png',
      num_servings: 4,
    }
  ];

  it.only('munges favorites data', async () => {
    // arrange
    // expected is in variable above
    // movieData is imported from file

    // act 
    const output = formatRecipes(recipes);

    // assert
    expect(output).toEqual(expectedFavorites);
  });

});