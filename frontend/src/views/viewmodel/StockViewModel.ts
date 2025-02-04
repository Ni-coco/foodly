export class StockViewModel {
  public id!: string;
  public created_at!: string;
  public updated_at!: string;
  public productId!: string;
  public quantity!: number;
  public product: any;

  Map(dto: any) {
    (this.id = dto.id),
      (this.created_at = dto.created_at),
      (this.updated_at = dto.updated_at),
      (this.productId = dto.productId),
      (this.quantity = dto.quantity),
      (this.product = dto.product);
  }
}
