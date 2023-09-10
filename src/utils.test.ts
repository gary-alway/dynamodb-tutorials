import {
  valueToAttributeValue,
  attributeValueToValue,
  attributeMapToValues,
  removePrefix,
  addPrefix
} from './utils'

describe('valueToAttributeValue', () => {
  it('should handle strings', () => {
    expect(valueToAttributeValue('test')).toEqual({ S: 'test' })
  })

  it('should handle numbers', () => {
    expect(valueToAttributeValue(42)).toEqual({ N: '42' })
  })

  it('should handle booleans', () => {
    expect(valueToAttributeValue(true)).toEqual({ BOOL: true })
  })

  it('should handle empty arrays', () => {
    expect(valueToAttributeValue([])).toEqual({ L: [] })
  })

  it('should handle arrays of mixed types', () => {
    expect(valueToAttributeValue([1, 'two', false])).toEqual({
      L: [{ N: '1' }, { S: 'two' }, { BOOL: false }]
    })
  })

  it('should handle objects', () => {
    expect(valueToAttributeValue({ key1: 'value1', key2: 42 })).toEqual({
      M: { key1: { S: 'value1' }, key2: { N: '42' } }
    })
  })

  it('should throw an error for unknown types', () => {
    expect(() => valueToAttributeValue(undefined)).toThrow(
      'Unknown type undefined'
    )
  })
})

describe('attributeValueToValue', () => {
  it('should handle strings', () => {
    expect(attributeValueToValue({ S: 'test' })).toEqual('test')
  })

  it('should handle numbers', () => {
    expect(attributeValueToValue({ N: '42' })).toEqual(42)
  })

  it('should handle booleans', () => {
    expect(attributeValueToValue({ BOOL: true })).toEqual(true)
  })

  it('should handle empty arrays', () => {
    expect(attributeValueToValue({ L: [] })).toEqual([])
  })

  it('should handle arrays of mixed types', () => {
    expect(
      attributeValueToValue({
        L: [{ N: '1' }, { S: 'two' }, { BOOL: false }]
      })
    ).toEqual([1, 'two', false])
  })

  it('should handle objects', () => {
    expect(
      attributeValueToValue({
        M: { key1: { S: 'value1' }, key2: { N: '42' } }
      })
    ).toEqual({ key1: 'value1', key2: 42 })
  })

  it('should throw an error for unknown types', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => attributeValueToValue({ unknownType: 'test' } as any)).toThrow(
      'Unknown type {"unknownType":"test"}'
    )
  })
})

describe('attributeMapToValues', () => {
  it('should handle an empty object', () => {
    expect(attributeMapToValues({})).toEqual([])
  })

  it('should convert an object to an array of values', () => {
    const input = {
      key1: { S: 'value1' },
      key2: { N: '42' },
      key3: { BOOL: true }
    }
    expect(attributeMapToValues(input)).toEqual({
      key1: 'value1',
      key2: 42,
      key3: true
    })
  })
})

describe('removePrefix', () => {
  it('should remove a prefix from a string', () => {
    expect(removePrefix('prefix-test', 'prefix-')).toEqual('test')
  })

  it('should return the same string if prefix is not found', () => {
    expect(removePrefix('test', 'prefix-')).toEqual('test')
  })
})

describe('addPrefix', () => {
  it('should add a prefix to a string', () => {
    expect(addPrefix('test', 'prefix-')).toEqual('prefix-test')
  })
})
