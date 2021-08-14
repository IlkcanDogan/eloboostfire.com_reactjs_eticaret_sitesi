const Discord = require("discord.js");
const client = new Discord.Client();
const disbut = require('discord-buttons');
disbut(client);

var order = require('./views/models/order');
const config = {
	token: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
	channelID: 'xxxxxxxxxxxxxxxx',
}

let button = new disbut.MessageButton()
	.setLabel("Accecpt")
	.setStyle("blurple")
	.setID("accept_button")


const sendOrderInfo = (embedData) => {
	const Channel = client.channels.cache.get(config.channelID);
	if (!Channel) return console.error("Couldn't find the channel.");
	Channel.send({ embed: embedData, button: button }).then(() => /*client.destroy()*/ false)
}


client.on("ready", () => {
	client.on('clickButton', async (button) => {
		if (button.id === 'accept_button') {
			await button.clicker.fetch();
			let orderNumber = fixJSON(button.message.embeds[0]).author.name.split(':')[1].replace(' ', '')
			order.find({orderId: orderNumber, discordAcceptUsername: ''}).then((data) => {
				if(data.length){
					order.findOneAndUpdate({orderId: orderNumber}, {discordAcceptUsername:button.clicker.user.tag, orderCheck: true}).then((orderData) => {
						button.channel.send(`${button.clicker.user.tag} accepted order!`);
                        client.users.fetch(button.clicker.user.id, false).then((user) => {
                            user.send({ embed: button.message.embeds[0]});
                            user.send("Thank you for accepting the order. All the necessary information is located above.\n-------- Account Info ---------\n" + "Password: " + orderData.account[0].password + "\nAccount ID: " + orderData.account[0].accountId + "\nSummoner Name: " + orderData.account[0].summonerName);
                        });
                        console.log("ORDER DATA: ", orderData.account[0].password )
					})
				}
				else {
					console.log("Already accepted order! ");
				}
			})
			await button.defer();
            
		}
	});
});
 
client.login(config.token)

function fixJSON(json){
    function bulkRegex(str, callback){
        if(callback && typeof callback === 'function'){
            return callback(str);
        }else if(callback && Array.isArray(callback)){
            for(let i = 0; i < callback.length; i++){
                if(callback[i] && typeof callback[i] === 'function'){
                    str = callback[i](str);
                }else{break;}
            }
            return str;
        }
        return str;
    }
    if(json && json !== ''){
        if(typeof json !== 'string'){
            try{
                json = JSON.stringify(json);
            }catch(e){return false;}
        }
        if(typeof json === 'string'){
            json = bulkRegex(json, false, [
                str => str.replace(/[\n\t]/gm, ''),
                str => str.replace(/,\}/gm, '}'),
                str => str.replace(/,\]/gm, ']'),
                str => {
                    str = str.split(/(?=[,\}\]])/g);
                    str = str.map(s => {
                        if(s.includes(':') && s){
                            let strP = s.split(/:(.+)/, 2);
                            strP[0] = strP[0].trim();
                            if(strP[0]){
                                let firstP = strP[0].split(/([,\{\[])/g);
                                firstP[firstP.length-1] = bulkRegex(firstP[firstP.length-1], false, p => p.replace(/[^A-Za-z0-9\-_]/, ''));
                                strP[0] = firstP.join('');
                            }
                            let part = strP[1].trim();
                            if((part.startsWith('"') && part.endsWith('"')) || (part.startsWith('\'') && part.endsWith('\'')) || (part.startsWith('`') && part.endsWith('`'))){
                                part = part.substr(1, part.length - 2);
                            }
                            part = bulkRegex(part, false, [
                                p => p.replace(/(["])/gm, '\\$1'),
                                p => p.replace(/\\'/gm, '\''),
                                p => p.replace(/\\`/gm, '`'),
                            ]);
                            strP[1] = ('"'+part+'"').trim();
                            s = strP.join(':');
                        }
                        return s;
                    });
                    return str.join('');
                },
                str => str.replace(/(['"])?([a-zA-Z0-9\-_]+)(['"])?:/g, '"$2":'),
                str => {
                    str = str.split(/(?=[,\}\]])/g);
                    str = str.map(s => {
                        if(s.includes(':') && s){
                            let strP = s.split(/:(.+)/, 2);
                            strP[0] = strP[0].trim();
                            if(strP[1].includes('"') && strP[1].includes(':')){
                                let part = strP[1].trim();
                                if(part.startsWith('"') && part.endsWith('"')){
                                    part = part.substr(1, part.length - 2);
                                    part = bulkRegex(part, false, p => p.replace(/(?<!\\)"/gm, ''));
                                }
                                strP[1] = ('"'+part+'"').trim();
                            }
                            s = strP.join(':');
                        }
                        return s;
                    });
                    return str.join('');
                },
            ]);
            try{
                json = JSON.parse(json);
            }catch(e){return false;}
        }
        return json;
    }
    return false;
}
module.exports.bot = function (embedData) {
	sendOrderInfo(embedData)
}