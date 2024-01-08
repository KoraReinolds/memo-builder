import { createGroup, getGroupByName } from '~/db/groups'
import { addNewItemToList } from '~/db/items'
import { createList } from '~/db/lists'

const patternNames = [
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

function getPromisesList(list: any[], listId: number) {
  return list.map(
    (data) =>
      new Promise((resolve) => resolve(addNewItemToList({ listId, data }))),
  )
}

async function initDBItems() {
  const userId = 1
  const group = await createGroup({ userId, name })
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

  return { types, itemsEN, itemsRU }
}

export default defineEventHandler(async () => {
  if (!(await getGroupByName(name))) return await initDBItems()
  return ['Done']
})
