import { prisma } from '../games.js'

const gamesType = `
  type games {
    idGames: ID!
    nameGames: String
    idEditors: Int
    editors: editors
    stock: [stock]
  }

  input gamesInput {
    nameGames: String
    idEditors: Int
  }
`

const gamesMutations = `
  insertGames (value: gamesInput): [games]
  updateGames (id: Int!, value: gamesInput): [games]
  deleteGames (id: Int!): [games]
`

const gamesQuery = `
  "Permet de récupérer les valeurs contenus dans la table Games."
  getGames : [games]
`

const gamesFunctions = {
  getGames: () => {
    return prisma.games.findMany({
      include: {
        editors: true
      }
    })
  },

  insertGames: async ({ value }) => {
    await prisma.games.create({
      data: value
    })

    return prisma.games.findMany({
      include: {
        editors: true
      }
    })
  },

  updateGames: async ({ id, value }) => {
    await  prisma.games.update({
      where: {
        idGames: id
      },
      data: value
    })

    return prisma.games.findMany({
      include: {
        editors: true
      }
    })
  },

  deleteGames: async ({ id }) => {
    await prisma.games.delete({
      where: {
        idGames: id
      }
    })

    return prisma.games.findMany()
  }
}

export {
  gamesType,
  gamesQuery,
  gamesMutations,
  gamesFunctions
}
