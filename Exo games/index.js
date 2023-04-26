import express from 'express'
import { buildSchema } from 'graphql'
import { graphqlHTTP } from 'express-graphql'
import livereload from 'livereload'
import connectLiveReload from 'connect-livereload'

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

let students = [{
  id: 0,
  lastname: 'Pheng',
  firstname: 'Henry'
}, {
  id: 1,
  lastname: 'Ledoux',
  firstname: 'Cécile'
}]

let schema = buildSchema(`
    type Student {
      id: Int!
      lastname: String!
      firstname: String
    }

    type Query {
      getStudents: [Student]
    }
    
    type Mutation {
      insertStudent (lastname : String, firstname: String): [Student]
      updateStudent (slug: Int!, newLastname: String, newFirstname: String): [Student]
      deleteStudent (slug: Int!): [Student] 
    }
`)

let root = {
  getStudents() {
    return students
  },

  insertStudent({lastname, firstname}) {
    const id = students.length ? students[students.length - 1].id + 1 : 0
    let e = {
      'id': id,
      lastname,
      firstname
    }
    students.push(e)

    return students
  },

  updateStudent({slug, newFirstname, newLastname}) {
    // const indexOfStudentToUpdate = students.findIndex((student) => student.id === slug)
    //
    // if (indexOfStudentToUpdate !== -1) {
    //   if (newFirstname) {
    //     students[indexOfStudentToUpdate].firstname = newFirstname
    //   }
    //
    //   if (newLastname) {
    //     students[indexOfStudentToUpdate].lastname = newLastname
    //   }
    // }

    for (let i of students) {
      if (i.id === slug) {
        if (newFirstname) {
          i.firstname = newFirstname
        }
        if (newLastname) {
          i.lastname = newLastname
        }
      }
    }

    return students
  },

  deleteStudent({slug}) {
    // const indexOfStudentToDelete = students.findIndex((student) => student.id === slug)
    //
    // if (indexOfStudentToDelete !== -1) {
    //   students.splice(indexOfStudentToDelete, 1)
    // }

    students = students.filter((student) => student.id !== slug)

    return students
  }
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

app.listen(4000)
