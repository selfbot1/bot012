const Discord = require("discord.js");
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setGame("n!help", "https://go.twitch.tv/pallavbs"); // a game
  client.user.setStatus("online"); // Set status to DnD

});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

client.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.find('name', 'member-log');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`A new survivor has been spotted, ${member}`);
});


client.on("message", (message) => {
  // This event will run on every single message received, from any channel or DM.
  
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  console.log(message.guild.name)
  if(!message.member.roles.some(r=>["Administrator", "Moderator", "Admin", "Leader", "Owner"].includes(r.name)) )
        return ;  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // Let's go with a few common example commands! Feel free to delete or change those.
  
  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    message.channel.send("Ping?").then((msg)=>{
    msg.edit('Pong!')
    })
                                       }
  
  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    var chanell=args[0];
    var len = chanell.length;
    if(len === 21){
      let text = args.slice(1).join(" ");      
      let str=args[0];
      var targetchannel=args[0].replace("<#","").replace(">","");
      let channel = client.channels.get(targetchannel);
      channel.send(text);}
    else{
       message.channel.send(sayMessage);}
  }
  
  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit: 
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["Administrator", "Moderator", "Admin"].includes(r.name)) )
      return ;
    
    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    
    // slice(1) removes the first part, which here should be the user mention!
    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Please indicate a reason for the kick!");
    
    // Now, time for a swift kick in the nuts!
    member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.channel.send(`${member.user.tag} has been kicked by ${message.author} because: ${reason}`);

  }
  
  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["Administrator", "Admin"].includes(r.name)) )
      return ;
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable) 
      return message.reply("I cannot ban this user. :FeelsBadMan:");

    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Please indicate a reason for the ban!");
    
    member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }
  
  if(command === "purge" || command === "prune") {
  // This command removes all messages from all users in the channel, up to 100.
      
    // This command must be limited to mods and admins. In this example we just hardcode the role names.

    if(!message.member.roles.some(r=>["Administrator", "Moderator", "Admin"].includes(r.name)) )
      return ;
      
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10) + 1;
    message.channel.fetchMessages({limit: deleteCount}).then(messages => message.channel.bulkDelete(messages));

   }
  
  if(command === "eyes") {
      //This command send emoji the looks left and read
      
      message.channel.send("👀").then((msg)=>{
      var i = 0;
      while (i < 50) {
      msg.edit('<:eyes:374082394816249856>')
      msg.edit("👀");
      i++;
      }
      })
    
}                          
  
    if (command === "qwe") {
      var i = 0;
      while (i < 50) {
      message.channel.send(50-i)
      i++;
      }
}
  if (command === "avatar" || command === 'avi') {
    let member = message.mentions.members.first();
    
  // Send the user's avatar URL
    message.reply(member.avatarURL);
  
}
   if (command === "help") {
    message.author.send("**Prefix:** `n!`\n" +
  "__**Commands**__:\nping\nsay\nkick\nban\npurge\neyes\navatar ");}
});

client.login(process.env.BOT_TOKEN);
