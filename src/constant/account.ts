export const accountTypeCode = {
  income: '10002',
  expense: '10003'
}

export const accountTypeText = {
  [accountTypeCode.income]: '支出',
  [accountTypeCode.expense]: '收入',
}

export const accountTypes = [
  { name: '支出', value: accountTypeCode.expense },
  { name: '收入', value: accountTypeCode.income }
]

export const dateType = [
  { label: '年', value: 'year' },
  { label: '月', value: 'month' },
  { label: '日', value: 'day' },
]

export const dateTypeText = {
  'year': '年',
  'month': '月',
  'day': '日'
}