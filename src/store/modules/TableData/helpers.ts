export function toFloat (arg: string | number): number {
  let res;
  if (arg === '') {
    res = 0;
  } else if (typeof arg === 'string') {
    res = parseFloat(arg.replace(/,/gi, '.'));
  } else {
    res = arg;
  }
  return isNaN(res) ? 0 : res;
}
