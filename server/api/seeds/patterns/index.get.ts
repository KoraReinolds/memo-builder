import { createGroup, getGroups } from '~/db/groups'
import { createItem } from '~/db/items'
import { createList } from '~/db/lists'
import { createLinks } from '~/db/relations'
import { getQueryId } from '~/server/query'

const patternNames: [string, string, number][] = [
  ['Абстрактная фабрика', 'Abstract factory', 1],
  ['Адаптер', 'Adapter', 2],
  ['Декоратор', 'Decorator', 2],
  ['Заместитель', 'Proxy', 2],
  ['Итератор', 'Iterator', 3],
  ['Команда', 'Command', 3],
  ['Компановщик', 'Compositor', 2],
  ['Легковес', 'Flyweight', 2],
  ['Мост', 'Bridge', 2],
  ['Наблюдатель', 'Watcher', 3],
  ['Одиночка', 'Singleton', 1],
  ['Посетитель', 'Visitor', 3],
  ['Посредник', 'Mediator', 3],
  ['Прототип', 'Prototype', 1],
  ['Снимок', 'Memento', 3],
  ['Состояние', 'State', 3],
  ['Стратегия', 'Strategy', 3],
  ['Строитель', 'Builder', 1],
  ['Фабричный метод', 'Factory method', 1],
  ['Фасад', 'Facade', 2],
  ['Цепочка обязанностей', 'Chain of responsibility', 3],
  ['Шаблонный метод', 'Template method', 3],
]

const patternTypes = ['Порождающий', 'Структурный', 'Поведенческий']

const name = 'Паттерны проектирования'

const getPromisesList = (list: any[], listId: number) =>
  list.map((data) => createItem({ listId, data }))

const initDBItems = async (id: number) => {
  const userId = 1
  const group = await createGroup({ id, userId, name })
  const listRU = await createList({ groupId: group.id, name: 'Название (RU)' })
  const listEN = await createList({ groupId: group.id, name: 'Название (EN)' })
  const listTypes = await createList({ groupId: group.id, name: 'Тип' })

  const promisesTypes = getPromisesList(patternTypes, listTypes.id)
  const promisesRU = getPromisesList(
    patternNames.map(([data]) => data),
    listRU.id,
  )
  const promisesEN = getPromisesList(
    patternNames.map(([_, data]) => data),
    listEN.id,
  )
  const itemsRU = await Promise.all(promisesRU)
  const itemsEN = await Promise.all(promisesEN)
  const types = await Promise.all(promisesTypes)

  const links: [number, number][] = []
  itemsRU.forEach((res, index) => {
    links.push([res.id, itemsEN[index].id])
    const listIndex = patternNames[index][2] - 1
    links.push([res.id, types[listIndex].id])
    links.push([itemsEN[index].id, types[listIndex].id])
  })

  await createLinks(links)

  return { types, itemsEN, itemsRU }
}

export default defineEventHandler(async (event) => {
  const id = getQueryId(getQuery(event))
  if ((await getGroups({ id })).length) return ['Done']
  return await initDBItems(id)
})
