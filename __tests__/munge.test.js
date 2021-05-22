import recipes from './recipesJson.json';
import { formatRecipes } from '../lib/munge-utils';

describe('API Data Munging', () => {

  const expectedFavorites = [
    {
      'name': 'Avocado Chicken Salad',
      'num_servings': 4,
      'thumbnail_url': 'https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/1211.jpg',
    },
    {
      'name': 'Bacon & Eggs Sweet Potato Toast',
      'num_servings': 1,
      'thumbnail_url': 'https://img.buzzfeed.com/thumbnailer-prod-us-east-1/4b4a331f190a42eea718eb95c81f8750/BFV21200_SweetPotatoToasts9Ways-Upload.jpg',
    },
    {
      'name': 'Cinnamon Toast Biscotti',
      'num_servings': 24,
      'thumbnail_url': 'https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/311728.jpg',
    },
    {
      'name': 'Sheet-Pan Shakshuka Toast',
      'num_servings': 9,
      'thumbnail_url': 'https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/172542.jpg',
    },
    {
      'name': 'Creamy Mushroom Toasts',
      'num_servings': 2,
      'thumbnail_url': 'https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/221417.jpg',
    },
    {
      'name': 'Cheesy Egg Toast Perfect For Breakfast',
      'num_servings': 1,
      'thumbnail_url': 'https://img.buzzfeed.com/video-api-prod/assets/bd2e246b2883465abaad8fb68739f6db/BFV4562_CheesyEggToast-Thumb1080.jpg',
    },
    {
      'name': 'Nutella Marshmallow French Toast',
      'num_servings': 1,
      'thumbnail_url': 'https://img.buzzfeed.com/thumbnailer-prod-us-east-1/5f54a4f9320d43ddaf2df1a189f89050/Nutella_Marshmallow_French_Toast.jpg',
    }
  ];

  it('munges favorites data', async () => {
    // arrange
    // expected is in variable above
    // movieData is imported from file

    // act 
    console.log(recipes);
    const output = formatRecipes(recipes);
    
    // assert
    expect(output).toEqual(expectedFavorites);
  });

});