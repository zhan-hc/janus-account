const units = [
  { unit: '涧‌', exponent: 36 },
  { unit: '沟‌', exponent: 32 },
  { unit: '穰‌', exponent: 28 },
  { unit: '秭', exponent: 24 },
  { unit: '垓', exponent: 20 },
  { unit: '京', exponent: 16 },
  { unit: '兆', exponent: 12 },
  { unit: '亿', exponent: 8 }
];

/** 格式化金额
 *  将数字转换成逗号分隔的样式,保留两位小数s:value,n:小数位数 数值过大是否用亿代替
*/
export function formatMoney (s, n, k = true) {
  if (Number(s) === 0 && n === 2) return '0.00'
  if (Number(s) === 0 || !s) return '0'
  if (k) {
    const num = Math.abs(Number(s));
    // 遍历单位列表
    for (const { unit, exponent } of units) {
        if (num > Math.pow(10, exponent - 1)) {
            const te = String(Number(s) / Math.pow(10, exponent));
            const arr = te.split('.');
            return `${arr[0]}.${arr[1] ? arr[1].slice(0, 2) : '00'}${unit}`;
        }
    }
}
  n = n >= 0 && n <= 20 ? n : 2
  s = parseFloat((s + '').replace(/[^\d.-]/g, ''))
  let prev = ''
  if (s < 0) {
    prev = '-'
    s = 0 - s
  }
  s = s.toFixed(n) + ''
  const l = s.split('.')[0].split('').reverse()
  const r = s.split('.')[1]
  let t = ''
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '')
  }
  return prev + t.split('').reverse().join('') + (n > 0 ? '.' + r : '')
}

export function transformMonthData(data: any, year: string) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentYear === parseInt(year, 10) ? currentDate.getMonth() + 1 : 12;

  // 动态生成当年有效月份（不包含未来月份）
  const months = Array.from({ length: currentMonth }, (_, i) =>
      `${year}-${String(i + 1).padStart(2, "0")}`
  );

  // 将数据转换为按月份存储的格式
  const dataMap = data.reduce((acc, item) => {
      if (!acc[item.month]) {
          acc[item.month] = { income: 0, expense: 0 };
      }
      if (item.type_id === "10002") {
          acc[item.month].income = item.totalAmount;
      } else if (item.type_id === "10003") {
          acc[item.month].expense = item.totalAmount;
      }
      return acc;
  }, {});

  // 填充每个月的数据
  const result = months.map((month) => ({
      month,
      income: dataMap[month]?.income || 0,
      expense: dataMap[month]?.expense || 0,
  }));

  return result;
}