export class ResponseBody<T> {
  public success?: boolean;
  public data?: T;
  public error?: string;

  constructor(dto: any) {
    this.Map(dto);
  }

  public Map(dto: any) {
    this.success = dto.success;
    this.data = dto.data;
    this.error = dto.error;
    return this;
  }
}
