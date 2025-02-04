const StockDto = class {
  constructor(dto, product) {
    (this.id = dto.id),
      (this.created_at = dto.created_at),
      (this.updated_at = dto.updated_at),
      (this.productId = dto.product_id),
      (this.quantity = dto.quantity),
      (this.price = dto.price),
      (this.product = (product??null));
  }
};

module.exports = { StockDto };
