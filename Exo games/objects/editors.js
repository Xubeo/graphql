import { prisma } from '../games.js'

const editorsType = `
  type editors {
    idEditors: ID!
    nameEditors: String!
    games: [games]  
  }

  input editorsInput {
      nameEditors: String!
  }
`

const editorsQuery = `
  "Permet de récupérer les valeurs contenus dans la table Editors."
  getEditors : [editors]  
`

const editorsMutation = `
  insertEditors (value: editorsInput): [editors]
  updateEditors (id: Int!, value: editorsInput): [editors]
  deleteEditors (id: Int!): [editors]
`

const editorsFunctions = {
  getEditors: () => {
    return prisma.editors.findMany()
  },

  insertEditors: async ({ value }) => {
    await prisma.editors.create({
      data: value
    })

    return prisma.editors.findMany()
  },

  updateEditors: async ({ id, value }) => {
    await prisma.editors.update({
      where: {
        idEditors: id
      },
      data: value
    })

    return prisma.editors.findMany({
      include: {
        games: true
      }
    })
  },

  deleteEditors: async ({ id }) => {
    await prisma.editors.delete({
      where: {
        idEditors: id
      }
    })

    return prisma.editors.findMany()
  }
}

export {
  editorsType,
  editorsQuery,
  editorsMutation,
  editorsFunctions
}
