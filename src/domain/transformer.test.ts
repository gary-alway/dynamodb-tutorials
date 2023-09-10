import { dynamoRecordToEntity } from './transformer'

describe('dynamoRecordToEntity', () => {
  it('should throw an error for unknown entity type', () => {
    const unknownRecord = {
      entityType: { S: 'unknown-type' }
    }

    const fn = () => dynamoRecordToEntity(unknownRecord)

    expect(fn).toThrowError('Unknown entity type unknown-type')
  })
})
