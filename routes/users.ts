import {type Request, type Response, Router} from 'express'
import {prisma} from '../libs/prisma.ts'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany()
  res.render('users/index',{
    title: 'Users/Index',
    content: users
  })
})

export default router