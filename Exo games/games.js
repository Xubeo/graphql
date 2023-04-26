import { PrismaClient } from '@prisma/client'
import express from 'express'
import { buildSchema } from 'graphql'
import { graphqlHTTP } from 'express-graphql'
import livereload from 'livereload'
import connectLiveReload from 'connect-livereload'

import { editorsType, editorsQuery, editorsMutation, editorsFunctions } from './objects/editors.js'
import { storesType, storesQuery, storesMutations, storesFunctions } from './objects/stores.js'
import { stockType, stockQuery, stockMutations, stockFunctions } from './objects/stock.js'
import { gamesType, gamesQuery, gamesMutations, gamesFunctions } from './objects/games.js'

export const prisma = new PrismaClient()

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

let schema = buildSchema(`
  ${gamesType}
  ${editorsType}
  ${storesType}
  ${stockType}

  type Query {
    ${gamesQuery}
    ${editorsQuery}
    ${storesQuery}
    ${stockQuery}
  }

  type Mutation {
    ${gamesMutations}
    ${editorsMutation}
    ${storesMutations}
    ${stockMutations}
  }
`)

let root = {
  ...gamesFunctions,
  ...editorsFunctions,
  ...storesFunctions,
  ...stockFunctions
}

let app = express()
app.use(connectLiveReload())
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
)

app.listen(4001)
