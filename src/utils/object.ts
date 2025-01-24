/**
 * 冻结对象，防止数据被修改
 * @template T
 * @param {T} obj
 * @returns {T}
 */
export const freezeObject = (obj: object): object => {
  if (typeof obj !== 'object' || typeof Proxy !== 'function') return obj

  return new Proxy(obj, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver)

      if (typeof value == 'object') {
        return freezeObject(value)
      }

      return value
    },
    set(target, key, value, receiver) {
      console.warn('对象已被冻结，禁止修改', target, key, value)
      return true
    }
  })
}
