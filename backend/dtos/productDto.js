const Product = class {
  constructor(dto) {
    this.id = dto.code;
    this.brands = dto.brands || null;
    this.origins = dto.origins || null;
    this.quantity = dto.quantity || null;
    this.generic_name = dto.generic_name || null;
    this.ingredients = dto.ingredients || [];
    this.allergens = dto.allergens || '';
    this.labels = dto.labels || '';
    this.nutriscore = {
      year: dto.nutriscore_version || '',
      nutriscore: dto.nutriscore_data || {},
    };
    this.nutrient_levels = {
      fat: dto.nutrient_levels?.fat || null,
      salt: dto.nutrient_levels?.salt || null,
      'saturated-fat': dto.nutrient_levels?.['saturated-fat'] || null,
      sugars: dto.nutrient_levels?.sugars || null,
    };

    this.nutriments = {
      'energy-kcal_100g': dto.nutriments?.['energy-kcal_100g'] || '0',
      'fat_100g': dto.nutriments?.['fat_100g'] || '0',
      'saturated-fat_100g': dto.nutriments?.['saturated-fat_100g'] || '0',
      'carbohydrates_100g': dto.nutriments?.['carbohydrates_100g'] || '0',
      'sugars_100g': dto.nutriments?.['sugars_100g'] || '0',
      'proteins_100g': dto.nutriments?.['proteins_100g'] || '0',
      'salt_100g': dto.nutriments?.['salt_100g'] || '0',
    };

    this.img = this.extractImages(dto.selected_images);
  }

  extractImages(images) {
    if (!images || !images.front || !images.front.display) {
      return {
        front: '',
        ingredients: '',
        nutrition: '',
      };
    }
    return {
      front: images.front.display.en || null,
      ingredients: images.ingredients?.display?.en || null,
      nutrition: images.nutrition?.display?.en || null,
    };
  }
};

module.exports = { Product };
