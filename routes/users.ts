import {type Request, type Response, Router} from 'express'
import {prisma} from '../libs/prisma.ts'
import {matchedData, query} from 'express-validator'
import type {UserWhereInput} from '../generated/prisma/models/User.ts'

const router = Router()

router.get('/',
  query('id').toInt().default(0),
  async (req: Request, res: Response) => {
    const {id} = matchedData<{ id: number }>(req)

    const users = id <= 0 ? await prisma.user.findMany()
      : await prisma.user.findMany({where: {id: {lte: id}}})
    //                             {where: {`field`: value}}
    //                             {where: {`field`: {`op`: value}}}
    res.render('users/index', {
      title: 'Users/Index',
      content: users,
    })
  },
)

router.get('/find',
  query('name').default(''),
  query('min').toInt().default(-1),
  query('max').toInt().default(-1),
  async (req: Request, res: Response) => {
    const {name, min, max} = matchedData<{ name: string, min: number, max: number }>(req)
    const whereAnd: UserWhereInput[] = []

    if (name) {
      whereAnd.push({name: {contains: name}})
    }
    if (min >= 0) {
      whereAnd.push({age: {gte: min}})
    }
    if (max >= 0) {
      whereAnd.push({age: {lte: max}})
    }

    const users = await prisma.user.findMany({
      where: {AND: whereAnd},
    })

    res.render('users/index', {
      title: 'Users/Find',
      content: users,
    })
  },
)

export default router