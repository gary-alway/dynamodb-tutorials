import { AttributeValue } from '@aws-sdk/client-dynamodb'

export const valueToAttributeValue = <T>(value: T): AttributeValue => {
  switch (typeof value) {
    case 'string':
      return { S: value }
    case 'number':
      return { N: `${value}` }
    case 'boolean':
      return { BOOL: value }
    case 'object':
      if (Array.isArray(value)) {
        return { L: value.map(item => valueToAttributeValue(item)) }
      }
      return {
        M: Object.entries(value as Record<string, AttributeValue>).reduce(
          (acc, [key, item]) => ({
            ...acc,
            [key]: valueToAttributeValue(item)
          }),
          {}
        )
      }
    default:
      throw new Error(`Unknown type ${typeof value}`)
  }
}

export const attributeValueToValue = <T>(value: AttributeValue): T => {
  switch (true) {
    case !!value.S:
      return value.S as T
    case !!value.N:
      return Number(value.N) as T
    case value.BOOL !== null && value.BOOL !== undefined:
      return value.BOOL as T
    case !!value.L:
      return value.L!.map(item => attributeValueToValue(item)) as unknown as T
    case !!value.M:
      return Object.entries(value.M!).reduce(
        (acc, [key, item]) => ({ ...acc, [key]: attributeValueToValue(item) }),
        {}
      ) as unknown as T
    default:
      throw new Error(`Unknown type ${JSON.stringify(value)}`)
  }
}

export const attributeMapToValues = (
  items: Record<string, AttributeValue>
): unknown[] =>
  Object.keys(items).reduce(
    (acc, key) => ({
      ...acc,
      [key]: attributeValueToValue(items[key])
    }),
    []
  )

export const removePrefix = (id: string, prefix: string): string =>
  id.replace(prefix, '')

export const addPrefix = (id: string, prefix: string): string =>
  `${prefix}${removePrefix(id, prefix)}`
