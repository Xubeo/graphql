import { prisma } from '../games.js'

const stockType = `
  type stock {
    idStock: ID!
    idGames: Int
    idStores: Int
    units: Int
    prices: Float
    games: games
    stores: stores
  }

  input stockInput {
    idGames: Int!
    idStores: Int!
    units: Int!
    prices: Float
  }
`

const stockQuery = `
  "Permet de récupérer les valeurs contenus dans la table Stock."
  getStock: [stock]
`

const stockMutations = `
  insertStock (value: stockInput): [stock]
  updateStock (id: Int!, value: stockInput): [stock]
  deleteStock (id: Int!): [stock]
`

const stockFunctions = {
  getStock: () => {
    return prisma.stock.findMany({
      include: {
        games: {
          include: {
            editors: true
          }
        }
      }
    })
  },

  insertStock: async ({ value }) => {
    await prisma.stock.create({
      data: value
    })

    return prisma.stock.findMany({
      include: {
        games: true,
        stores: true
      }
    })
  },

  updateStock: async ({ id, value }) => {
    await prisma.stock.update({
      where: {
        idStock: id
      },
      data: value
    })

    return prisma.stock.findMany({
      include: {
        games: true,
        stores: true
      }
    })
  },

  deleteStock: async ({ id }) => {
    await prisma.stock.delete({
      where: {
        idStock: id
      }
    })

    return prisma.stock.findMany({
      include: {
        games: true,
        stores: true
      }
    })
  }
}

export {
  stockType,
  stockQuery,
  stockMutations,
  stockFunctions
}
