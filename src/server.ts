import express from 'express'
import cors from 'cors'
import { routes } from './routes'

const app = express()
app.use(express.json())
app.use(cors({
  origin: '*',
}))

app.use(routes)

app.listen(8080, ()=> {
  console.log('Server running on port 8080')
})