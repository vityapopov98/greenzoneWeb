const { json } = require('body-parser');
const express = require('express')
const { send } = require('process')
const app = express()
const server = require('http').createServer(app)
const WebSocket = require('ws')
const wss = new WebSocket.Server({server: server})
bodyParser = require('body-parser');

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./client/dist'));

var dataFromHome = {
  destinationName: String,
  payload: String
}


wss.on('connection', function connection(ws) {
    console.log('new connection')
    ws.send('Hello friend')
    ws.send('client connected')

    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
      // ws.send('Ну задрова')
      dataFromHome = message

      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            console.log('sending ro other', message)
          client.send(message);
        }
      });
    });

    app.post('/login', (req, res)=>{
        console.log('login route')
        console.log(req.body)
        ws.send(`${req.body.username} is here!!!`)
        res.json({status: 'ok'})
    })


});


app.get('/', (req, res)=>{
    res.sendFile(__dirname + "/index.html")
})

app.get('/dataFromHome', (req, res)=>{
  console.log('GET /data from home. Reply with data ', dataFromHome)
  res.json(dataFromHome)

})
app.get('/iphone', (req, res)=>{
  console.log('GET /data from home. Reply with data ', dataFromHome)
  res.json({data: 'hi iPhone'})

})

const PORT = process.env.PORT || 3000;

server.listen(PORT, ()=>{
    console.log('listen on 3000 port')
})


// var ledState = 0;
// var ledCommand = '';
// var ledCommandSend = false;

// app.get('/', function (req, res) {
//   res.send('Hello World')
// })

// app.get('/saveledstate', (req, res)=>{
//     // ledState = req.query.state;
//     // if(ledState == '') ledState = req.query.state
//     // console.log('get from broker', ledState)
//     // if(ledCommandSend){
//     //     console.log('send command: ', ledCommand)
//     //     // ledCommand = ''
//     //     ledCommandSend = false
//     //     if(ledState==1) res.json({command: '1'}); //включено
//     //     else res.json({command: ledState});
        
//     // }
//     // else{//команда не была отправлена еще. отправляем
//     //     ledCommandSend = true
//     //     // if(ledCommand === '') ledCommand = ledState
//     //     // console.log('send command else: ', ledCommand)
//     //     ledState = ledCommand
//     //     res.json({command: `${ledCommand}`})
//     // }
//     if(ledCommand != ''){
//         res.json({command: `${ledCommand}`})
//         ledCommand = '';
//     }
//     else{
//         res.json({command: ``})
//     }

// })

// app.get('/ledcommand', (req, res)=>{
//     ledCommand = req.query.command

//     res.send(`command ${ledCommand} set`)
// })


 
// app.listen(3000)