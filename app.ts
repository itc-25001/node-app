import http from 'node:http'
import fs from 'node:fs/promises'
import pug from 'pug'
import {URL} from 'node:url'
import qs from 'node:querystring'
import consumers from 'node:stream/consumers'
import * as querystring from 'node:querystring'

const indexPug = pug.compileFile('./index.pug')
const otherPug = pug.compileFile('./other.pug')
const styleCss = await fs.readFile('./style.css', 'utf8')


const server = http.createServer(getFromClient)

server.listen(3000)
console.log('Server start!')

// ここまでメインプログラム==========

// createServerの処理
async function getFromClient(req: http.IncomingMessage, res: http.ServerResponse) {
    const reqUrl = new URL(req.url || '', 'http://localhost:3000')

    switch (reqUrl.pathname) {
        case '/': {
            responseIndex(req, res)
            break
        }
        case '/other': {
            await responseOther(req, res)
            break
        }
        case '/style.css': {
            res.setHeader('Content-Type', 'text/css')
            res.write(styleCss)
            res.end()
            break
        }
        default:
            res.statusCode = 404
            res.setHeader('Content-Type', 'text/plain')
            res.end('Not Found')
            break
    }
}

// index のアクセス処理
function responseIndex(req: http.IncomingMessage, res: http.ServerResponse) {
    const content = indexPug({
        title: 'Index',
        content: 'これはIndexページです。'
    })
    res.setHeader('Content-Type', 'text/html')
    res.write(content)
    res.end()
}

// other のアクセス処理
async function responseOther(req: http.IncomingMessage, res: http.ServerResponse) {
    // POST以外でアクセス時の処理
    if (req.method !== 'POST') {
        res.statusCode = 405
        res.setHeader('Content-Type', 'text/plain')
        res.write('Method not allowed')
        res.end()
        return
    }

    // ここからPOSTアクセス時の処理
    const body = await consumers.text(req)
    const postData = qs.parse(body)
    const content = otherPug({
        title: 'Other',
        content: `これはOtherページです。あなたは「${postData.msg}」と書きました。`
    })
    res.setHeader('Content-Type', 'text/html')
    res.write(content)
    res.end()
}