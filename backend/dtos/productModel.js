const Product = class {
    constructor(dto) {
        this.id = dto.code;
        this.brands = dto.brands || 'Unknown';
        this.origins = dto.origins || 'Unknown';
        this.quantity = dto.quantity || 'Unknown';
        this.generic_name = dto.generic_name || 'Unknown';
        this.ingredients = dto.ingredients || [];
        this.allergens = dto.allergens || '';
        this.labels = dto.labels || '';
        this.nutriscore = {
            year: dto.nutriscore_version || '',
            nutriscore: dto.nutriscore_data || {},
        };
        this.nutrient_levels = {
            fat: dto.nutrient_levels?.fat || 'Unknown',
            salt: dto.nutrient_levels?.salt || 'Unknown',
            'saturated-fat': dto.nutrient_levels?.['saturated-fat'] || 'Unknown',
            sugars: dto.nutrient_levels?.sugars || 'Unknown',
        };
        this.selected_images = this.extractImages(dto.selected_images);
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
            front: images.front.display.en || 'Unknown',
            ingredients: images.ingredients?.display?.en || 'Unknown',
            nutrition: images.nutrition?.display?.en || 'Unknown',
        };
    }
};

module.exports = { Product };