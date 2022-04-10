const SIX_HOURS = 60 * 60 * 6;
export function expiresIn6Hours() {
  const nowSeconds = Math.floor(new Date().getTime() / 1000);
  return nowSeconds + SIX_HOURS;
}
