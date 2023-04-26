import { prisma } from '../games.js'

const storesType = `
  type stores {
    idStores: ID!
    nameStores: String!
    stock: [stock]
  }

  input storesInput {
    nameStores: String!
  }
`

const storesQuery = `
  "Permet de récupérer les valeurs contenus dans la table Stores."
  getStores: [stores]
`

const storesMutations = `
  insertStores (value: storesInput): [stores]
  updateStores (id: Int!, value: storesInput): [stores]
  deleteStores (id: Int!): [stores]
`

const storesFunctions = {
  getStores: () => {
    return prisma.stores.findMany({
      include: {
        stock: true
      }
    })
  },

  insertStores: async ({ value }) => {
    await prisma.stores.create({
      data: value
    })

    return prisma.stores.findMany()
  },

  updateStores: async ({ id, value }) => {
    await prisma.stores.update({
      where: {
        idStores: id
      },
      data: value
    })

    return prisma.stores.findMany({
      include: {
        stock: true
      }
    })
  },

  deleteStores: async ({ id }) => {
    await prisma.stores.delete({
      where: {
        idStores: id
      }
    })

    return prisma.stores.findMany()
  }
}

export {
  storesType,
  storesQuery,
  storesMutations,
  storesFunctions
}
