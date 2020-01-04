/**
 * VATUSA TMU for Discord
 * @author Blake Nahin <vatusa6@vatusa.net>
 */

//Initiate Discord API
const {Client, RichEmbed, Collection} = require('discord.js'),
      client                          = new Client()

//Initiate Environment Variables
require('dotenv').config()
const prefix = process.env.prefix

//Load Commands
client.commands = new Collection()
const fs = require('fs')
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
  const command = require('./commands/' + file)
  client.commands.set(command.name, command)
}

client.on('ready', () => {
  //Bot has logged in
  console.log(`Logged in as ${client.user.tag}!`)
})

//Message Listener
client.on('message', message => {
  if (!message.content.startsWith(prefix)) return //Process messages that start with prefix

  const args = message.content.slice(prefix.length).split(/ +/) //Explode rest of message into array
  const command = args.shift().toLowerCase() //Get first entry of array

  if (!client.commands.has(command)) return //No command exists

  try {
    client.commands.get(command).execute(message, args)
  } catch (err) {
    console.log(err)
    message.reply('Unable to execute command. Blake broke something. ;(')
  }

})

//Log in to Discord
client.login(process.env.botToken)