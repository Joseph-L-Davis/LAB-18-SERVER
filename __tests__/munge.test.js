import favorites from '../data/favorites.js';
import { formatFavorites } from '../lib/munge-utils';

describe('API Data Munging', () => {

  const expectedFavorites = [
    {
      name: 'fake dish',
      id: expect.any(Number),
      thumbnailUrl: 'string',
      numServings: '2',
      userId: 1
    }
  ];

  it.only('munges favorites data', async () => {
    // arrange
    // expected is in variable above
    // movieData is imported from file

    // act 
    const output = formatFavorites(favorites);

    // assert
    expect(output).toEqual(expectedFavorites);
  });

});