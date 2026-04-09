export function formatPrice(price: number): string {
  if (price >= 10_000_000) {
    const crore = price / 10_000_000;
    return `PKR ${crore % 1 === 0 ? crore : crore.toFixed(2)} Crore`;
  }
  if (price >= 100_000) {
    const lakh = price / 100_000;
    return `PKR ${lakh % 1 === 0 ? lakh : lakh.toFixed(1)} Lakh`;
  }
  return `PKR ${price.toLocaleString('en-PK')}`;
}

export function formatPriceShort(price: number): string {
  if (price >= 10_000_000) {
    const crore = price / 10_000_000;
    return `${crore % 1 === 0 ? crore : crore.toFixed(1)}Cr`;
  }
  if (price >= 100_000) {
    const lakh = price / 100_000;
    return `${lakh % 1 === 0 ? lakh : lakh.toFixed(1)}L`;
  }
  return price.toLocaleString('en-PK');
}
