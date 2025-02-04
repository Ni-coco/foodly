const axios = require('axios');
const { getProduct } = require('../utils/openFruitApiService');

jest.mock('axios');

describe('openFruitApiService', () => {
  it('should fetch a product by ID and return it with the correct ID', async () => {
    const mockProductResponse = {
      data: {
        product: {
          code: '25287165',
          brands: 'Brand C',
          selected_images: {
            front: {
              display: {
                en: 'image_url',
              },
            },
          },
        },
      },
    };

    axios.get.mockResolvedValueOnce(mockProductResponse);

    const result = await getProduct('25287165');
    expect(result.id).toBe('25287165');
  });

  it('should handle errors gracefully', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    await expect(getProduct('25287165')).rejects.toThrow('Network Error');
  });
});