export function splitArray(arr: Array<any>, size: number) {
  if (!Array.isArray(arr)) {
    throw new Error("第一个参数必须是数组");
  }
  if (typeof size !== "number" || size <= 0) {
    throw new Error("第二个参数必须是正整数");
  }

  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}