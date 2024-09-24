import express from 'express'
import databaseService from '~/services/database.services'
import usersRoute from '~/routes/users.routes'
import { errorHandlerDefault } from './utils/handlers'
const app = express()
const port = 3000

databaseService.connect()
app.use(express.json())
app.use('/users', usersRoute)
app.use(errorHandlerDefault)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
