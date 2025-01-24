import dayjs from 'dayjs'

export const dateFormat = (date: string | Date | number = new Date(), format: string = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(date).format(format)
}

// 根据类型获取当前的日期
export const getTypeCurDate = (type: 'year' | 'month' | 'day') => {
  const formats: Record<typeof type, string> = {
    year: 'YYYY',
    month: 'YYYY-MM',
    day: 'YYYY-MM-DD',
  }
  return dateFormat(new Date(), formats[type])
}

export const getDateObj = (
  type: 'year' | 'month' | 'day',
  dateStr?: string
): Record<string, string> => {
  const curDateStr = dateStr || getTypeCurDate('day');
  const [year, month = '01', day = '01'] = curDateStr.split('-');

  if (type === 'year') {
    return { year };
  }
  if (type === 'month') {
    return { year, month };
  }
  return { year, month, day };
};