import http from 'node:http'
import pug from 'pug'
import fs from 'node:fs/promises'
import {URL} from 'node:url'

const styleCss = await fs.readFile('./style.css', 'utf8')
const indexPug = pug.compileFile('./index.pug')
const otherPug = pug.compileFile('./other.pug')

const server = http.createServer(getFromClient)

server.listen(3000)
console.log('Server start!')

// ここまでがメインプログラム

// createServer の処理
async function getFromClient(req: http.IncomingMessage, res: http.ServerResponse) {
    const reqUrl = new URL(req.url || '', 'http://localhost:3000/')

    switch (reqUrl.pathname) {
        case '/': {
            const content = indexPug({
                title: 'Index',
                content: `これはIndexページです。あなたは、「${msg}と送りました。」`,
            })
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.write(content)
            res.end()
            break
        }
        case '/other': {
            const content = otherPug({
                title: 'Other',
                content: 'これは新しく用意したページです。',
            })
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.write(content)
            res.end()
            break
        }
        case '/style.css': {
            res.writeHead(200, {'Content-Type': 'text/css'})
            res.write(styleCss)
            res.end()
            break
        }
        default:
            res.writeHead(404, {'Content-Type': 'text/plain'})
            res.end('not found')
            break
    }
}