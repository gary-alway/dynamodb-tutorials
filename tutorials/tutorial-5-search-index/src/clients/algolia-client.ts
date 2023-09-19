import type { IndexableEntity } from '../types'
import { getSsmParameter } from './aws-clients'
import algoliasearch, { SearchIndex } from 'algoliasearch'

const ALGOLIA_API_KEY = 'algolia-apiKey'
const ALGOLIA_APP_ID = 'algolia-appId'
const ALGOLIA_INDEX = 'profiles'

export const getAlgoliaIndex = async (): Promise<SearchIndex> => {
  const [appId, apiKey] = await Promise.all([
    getSsmParameter(ALGOLIA_APP_ID),
    getSsmParameter(ALGOLIA_API_KEY)
  ])

  const algoliaClient = algoliasearch(appId, apiKey)
  return algoliaClient.initIndex(ALGOLIA_INDEX)
}

export const saveAlgoliaObject = async (
  index: SearchIndex,
  entity: IndexableEntity
) => {
  await index.saveObject({
    ...entity,
    objectID: entity.id
  })
}

export const deleteAlgoliaObject = async (
  index: SearchIndex,
  objectId: string
) => {
  await index.deleteObject(objectId)
}
