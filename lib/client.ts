// connect to stun to detect you external public address
// connect to server socket
// await response

import IChat from './IChat'

const clientSocket = require('socket.io-client');
const chalk = require('chalk');
const _username: string = generateUserID();
let _topic: string = "";
let topics: string[] = [];


console.log(` your Username ${_username}`);

const client = clientSocket.connect(('http://localhost:2453'));

client.on('connect', () => {
    console.log(chalk.blue('connected to server'));
    client.emit('getTopics');

    client.on('topics', (data: any) => {
        topics = data;
    });

    client.on('msgReceived', (message: any) => {
            if (message.topic == _topic){
                console.log( `${message.username}:${message.chatMessage}`);
            }
    });

});

process.stdin.on('data', (chunk) => {

    let value: string = chunk.toString().trim();
    let cmd: string[] = value.trim().split(' ');

    if (value == 'lst') {
        return console.table(topics);
    }

    else if (value == 'help'){ return console.log(chalk.cyan(help));}

    else if (cmd[0].trim() == 'opt-in') {

      if (cmd[1] == undefined) {
        return  console.log( chalk.bgRed('\ttopic not provide'));
      } else if( getTopics(cmd[1].trim().toString())){
        console.log(chalk.bgRed(` \tNo topic match ${cmd[1]}`))
      } else {
        console.log(chalk.green(`\t ${cmd[1]} joined successfully`));
        return _topic = cmd[1];
        }

    }else if( value == 'opt-out'){
      _topic = '';
      return console.log(chalk.cyan("\tOpt out successfully "))
    } else if (cmd[0].trim().toString() == '--') {

        let chat: IChat = {
            username: _username,
            chatMessage: chunk.toString().trim(),
            topic: _topic
        };

        if (_topic != '') {
            client.emit('message', chat)
        } else {
            console.log(chalk.redBright("\tJoin topic before you can send message"))
        }
    }else{
        console.log(' Message not sent,  Use -- to start message or type help')
    }

});


const help: string = " TermChat command \n" +
    "lst     list all topics\n" +
    "help     log command\n" +
    "opt-out   leave Topic\n" +
    "opt-in t   join group , t = topic\n" +
    "--   to send message start with -- and whitespace after --";


function getTopics(arg:string):boolean {
  client.emit('getTopics');
  return (!topics.includes(arg)) ;
}

 function generateUserID():string{
    return  'user'+ require('generate-pin').generatePin()
 }


