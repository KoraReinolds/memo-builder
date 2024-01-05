import { createGroup, getGroupByName } from '~/db/groups'
import { addNewItemToList } from '~/db/items'
import { createList } from '~/db/lists'

const patternNames = [
  ['Абстрактная фабрика', 'Abstract factory'],
  ['Адаптер', 'Adapter'],
  ['Декоратор', 'Decorator'],
  ['Заместитель', 'Proxy'],
  ['Итератор', 'Iterator'],
  ['Команда', 'Command'],
  ['Компановщик', 'Compositor'],
  ['Легковес', 'Flyweight'],
]

const name = 'Паттерны проектирования'

async function initDBItems() {
  const userId = 1
  const group = await createGroup({ userId, name })
  const listRU = await createList({ groupId: group.id, name: 'Название (RU)' })
  const listEN = await createList({ groupId: group.id, name: 'Название (EN)' })
  const promisesRU = patternNames.map(
    ([data]) =>
      new Promise((resolve) =>
        resolve(addNewItemToList({ listId: listRU.id, data })),
      ),
  )
  const promisesEN = patternNames.map(
    ([_, data]) =>
      new Promise((resolve) =>
        resolve(addNewItemToList({ listId: listEN.id, data })),
      ),
  )
  const itemsRU = await Promise.all(promisesRU)
  const itemsEN = await Promise.all(promisesEN)

  return { itemsEN, itemsRU }
}

export default defineEventHandler(async () => {
  if (!getGroupByName(name)) return await initDBItems()
  return ['Done']
})
