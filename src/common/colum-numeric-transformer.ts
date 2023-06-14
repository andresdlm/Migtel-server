export class ColumnNumericTransformer {
  from(data: string): number {
    return parseFloat(data);
  }
  to(data: number): number {
    return data;
  }
}
