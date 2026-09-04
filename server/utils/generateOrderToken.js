// Generates a unique order token in the format: GAS-YYYY-NNNNNN
// Uses a random 6-digit suffix. In a production system, use an atomic counter.
export function generateOrderToken() {
  const year = new Date().getFullYear();
  const suffix = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit random
  return `GAS-${year}-${suffix}`;
}
