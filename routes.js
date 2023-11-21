const fs = require('fs')
const requestHandler = (req, res) => {
    const { url, method, headers } = req
    // console.log(url, method, headers)
    if(url === '/') {
        res.write('<html>')
        res.write('<header><title>Enter Message</title></header>')
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>')
        res.write('</html>')
        return res.end() 
    }
    if(url === '/message' && method === 'POST') {
        // Add eventlistener for the data
        const body = []
        req.on('data', (chunk) => {
            body.push(chunk)
        })
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString()
            const message = parsedBody.split('=')[1]
            //use writefile for ansyc reasons
            fs.writeFile('message.txt', message, (err) => {
                res.writeHead(302, { Location: '/'}) // Identical to lines below
                // res.statusCode = 302
                // res.setHeader('Location', '/')
                return res.end()
            })
        })
    }
    res.setHeader('Content-Type', 'text/html')
    res.write('<html>')
    res.write('<header><title>My First Page</title></header>')
    res.write('<body><h1>Hello from my Node.js Server!</h1></body>')
    res.write('</html>')
    res.end()
    // process.exit() //hard exits the event loop, don't really want to use
    
}

module.exports = requestHandler
// exports.handler = requestHandler
// module.exports = {
//     handler: requestHandler
// }
// module.exports.handler = requestHandler
