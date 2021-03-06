const converter = require('video-converter');
const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype
} = require('@adiwajshing/baileys')
const { color, bgcolor } = require('./lib/color')
const { help } = require('./src/help')
const { wait, simih, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, banner, start, info, success, close } = require('./lib/functions')
const { fetchJson } = require('./lib/fetcher')
const { recognize } = require('./lib/ocr')
const fs = require('fs')
const moment = require('moment-timezone')
const { exec } = require('child_process')
const kagApi = require('@kagchi/kag-api')
const fetch = require('node-fetch')
const tiktod = require('tiktok-scraper')
const ffmpeg = require('fluent-ffmpeg')
const { removeBackgroundFromImageFile } = require('remove.bg')
const imgbb = require('imgbb-uploader')
const lolis = require('lolis.life')
const loli = new lolis()
const welkom = JSON.parse(fs.readFileSync('./src/welkom.json'))
const nsfw = JSON.parse(fs.readFileSync('./src/nsfw.json'))
const samih = JSON.parse(fs.readFileSync('./src/simi.json'))
prefix = '.'
blocked = []

function kyun(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
  return `${pad(hours)} Jam ${pad(minutes)} Menit ${pad(seconds)} Detik`
}

async function starts() {
	const client = new WAConnection()
	client.logger.level = 'warn'
	console.log(banner.string)
	client.on('qr', () => {
		console.log(color('[','white'), color('!','red'), color(']','white'), color(' Scan the qr code above'))
	})
	client.on('credentials-updated', () => {
		fs.writeFileSync('./BarBar.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))
		info('2', 'Login Info Updated')
	})
	fs.existsSync('./BarBar.json') && client.loadAuthInfo('./BarBar.json')
	client.on('connecting', () => {
		start('2', 'Connecting...')
	})
	client.on('open', () => {
		success('2', 'Connected')
	})
	await client.connect({timeoutMs: 30*1000})

	client.on('group-participants-update', async (anu) => {
		if (!welkom.includes(anu.jid)) return
		try {
			const mdata = await client.groupMetadata(anu.jid)
			console.log(anu)
			if (anu.action == 'add') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `Halo @${num.split('@')[0]}\nSelamat datang di group *${mdata.subject}*`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			} else if (anu.action == 'remove') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${num.split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `Sayonara @${num.split('@')[0]}👋`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
	client.on('CB:Blocklist', json => {
		if (blocked.length > 2) return
	    for (let i of json[1].blocklist) {
	    	blocked.push(i.replace('c.us','s.whatsapp.net'))
	    }
	})

	client.on('message-new', async (mek) => {
		try {
			if (!mek.message) return
			if (mek.key && mek.key.remoteJid == 'status@broadcast') return
			if (mek.key.fromMe) return
			global.prefix
			global.blocked
                        const cnfig = {'Authorization':'59etwdvliBQ0qhxTfiLhWgB5FbGg8AZHeS4hkUKP'}
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid
			const type = Object.keys(mek.message)[0]
			const apiKey = 'qKF5WI4Sk3kC11WQ1VD9'
			const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
			const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
			body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
			budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
			const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
			const args = body.trim().split(/ +/).slice(1)
			const isCmd = body.startsWith(prefix)

			mess = {
				wait: '⌛ Sedang di Prosess ⌛',
				success: '✔️ Berhasil ✔️',
				error: {
					stick: '❌ Gagal, terjadi kesalahan saat mengkonversi gambar ke sticker ❌',
					Iv: '❌ Link tidak valid ❌'
				},
				only: {
					group: '❌ Perintah ini hanya bisa di gunakan dalam group! ❌',
					ownerG: '❌ Perintah ini hanya bisa di gunakan oleh owner group! ❌',
					ownerB: '❌ Perintah ini hanya bisa di gunakan oleh owner bot! ❌',
					admin: '❌ Perintah ini hanya bisa di gunakan oleh admin group! ❌',
					Badmin: '❌ Perintah ini hanya bisa di gunakan ketika bot menjadi admin! ❌'
				}
			}

			const botNumber = client.user.jid
			const ownerNumber = ["628811883541@s.whatsapp.net"] // replace this with your number
			const isGroup = from.endsWith('@g.us')
			const sender = isGroup ? mek.participant : mek.key.remoteJid
			const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
			const groupName = isGroup ? groupMetadata.subject : ''
			const groupId = isGroup ? groupMetadata.jid : ''
			const groupMembers = isGroup ? groupMetadata.participants : ''
			const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
			const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
			const isGroupAdmins = groupAdmins.includes(sender) || false
			const isWelkom = isGroup ? welkom.includes(from) : false
			const isNsfw = isGroup ? nsfw.includes(from) : false
			const isSimi = isGroup ? samih.includes(from) : false
			const isOwner = ownerNumber.includes(sender)
			const isUrl = (url) => {
			    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
			}
			const reply = (teks) => {
				client.sendMessage(from, teks, text, {quoted:mek})
			}
			const sendMess = (hehe, teks) => {
				client.sendMessage(hehe, teks, text)
			}
			const mentions = (teks, memberr, id) => {
				(id == null || id == undefined || id == false) ? client.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": memberr}})
			}

			colors = ['red','white','black','blue','yellow','green']
			const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
			const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
			if (!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (!isGroup && !isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			if (!isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			switch(command) {
				case 'help':
				case 'menu':
                                        try {
					 client.sendMessage(from, help(prefix), text)
					 break
                                        } catch (err) { return reply('error') }
				case 'info':
                                      try {
					me = client.user
					uptime = process.uptime()
					teks = `*Nama bot* : ${me.name}\n*Nomor Bot* : @${me.jid.split('@')[0]}\n*Prefix* : ${prefix}\n*Total Block Contact* : ${blocked.length}\n*The bot is active on* : ${kyun(uptime)}`
					buffer = await getBuffer(me.imgUrl)
					client.sendMessage(from, buffer, image, {caption: teks, contextInfo:{mentionedJid: [me.jid]}})
					break
                                      } catch (err) { return reply('error') }
				case 'blocklist':
                                      try {
					teks = 'This is list of blocked number :\n'
					for (let block of blocked) {
						teks += `~> @${block.split('@')[0]}\n`
					}
					teks += `Total : ${blocked.length}`
					client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": blocked}})
					break
                                      } catch (err) { return reply('error') }
				case 'ocr':
                                      try {
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						reply(mess.wait)
						await recognize(media, {lang: 'eng+ind', oem: 1, psm: 3})
							.then(teks => {
								reply(teks.trim())
								fs.unlinkSync(media)
							})
							.catch(err => {
								reply(err.message)
								fs.unlinkSync(media)
							})
					} else {
						reply('Foto aja mas')
					}
					break
                                      } catch (err) { return reply('error') }
				case 'stiker':
				case 'sticker':
                                       try {
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
                                                                try {
    								 fs.unlinkSync(media)
								 reply(mess.error.stick)
                                                                } catch (err) { return reply('error') }
							})
							.on('end', function () {
								console.log('Finish')
								buff = fs.readFileSync(ran)
								client.sendMessage(from, buff, sticker, {quoted: mek})
                                                                try {
								 fs.unlinkSync(media)
								 fs.unlinkSync(ran)
                                                                } catch (err) { return reply('error') }
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
						const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						reply(mess.wait)
						await ffmpeg(`./${media}`)
							.inputFormat(media.split('.')[1])
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
                                                                try {
 								 fs.unlinkSync(media)
                                                                } catch (err) { return reply('error') }
								tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								reply(`❌ Gagal, pada saat mengkonversi ${tipe} ke stiker`)
							})
							.on('end', function () {
								console.log('Finish')
								buff = fs.readFileSync(ran)
								client.sendMessage(from, buff, sticker, {quoted: mek})
                                                                try {
								 fs.unlinkSync(media)
								 fs.unlinkSync(ran)
                                                                } catch (err) { return reply('error') }
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia || isQuotedImage) && args[0] == 'nobg') {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ranw = getRandom('.webp')
						ranp = getRandom('.png')
						reply(mess.wait)
						keyrmbg = 'Your-ApiKey'
						await removeBackgroundFromImageFile({path: media, apiKey: keyrmbg.result, size: 'auto', type: 'auto', ranp}).then(res => {
							fs.unlinkSync(media)
							let buffer = Buffer.from(res.base64img, 'base64')
							fs.writeFileSync(ranp, buffer, (err) => {
								if (err) return reply('Gagal, Terjadi kesalahan, silahkan coba beberapa saat lagi.')
							})
							exec(`ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${ranw}`, (err) => {
								fs.unlinkSync(ranp)
								if (err) return reply(mess.error.stick)
								buff = fs.readFileSync(ranw)
								client.sendMessage(from, buff, sticker, {quoted: mek})
							})
						})
					/*} else if ((isMedia || isQuotedImage) && colors.includes(args[0])) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.on('start', function (cmd) {
								console.log('Started :', cmd)
							})
							.on('error', function (err) {
								fs.unlinkSync(media)
								console.log('Error :', err)
							})
							.on('end', function () {
								console.log('Finish')
								fs.unlinkSync(media)
								buff = fs.readFileSync(ran)
								client.sendMessage(from, buff, sticker, {quoted: mek})
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=${args[0]}@0.0, split [a][b]; [a] palettegen=reserve_transparent=off; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)*/
					} else {
						reply(`Kirim gambar dengan caption ${prefix}sticker atau tag gambar yang sudah dikirim`)
					}
					break
                                       } catch (err) { return reply('error') }
				case 'gtts':
                                      try {
					if (args.length < 1) return client.sendMessage(from, 'Kode bahasanya mana om?', text, {quoted: mek})
					const gtts = require('./lib/gtts')(args[0])
					if (args.length < 2) return client.sendMessage(from, 'Textnya mana om', text, {quoted: mek})
					dtt = body.slice(9)
					ranm = getRandom('.mp3')
					rano = getRandom('.ogg')
					dtt.length > 600
					? reply('Textnya kebanyakan om')
					: gtts.save(ranm, dtt, function() {
						exec(`ffmpeg -i ${ranm} -ar 48000 -vn -c:a libopus ${rano}`, (err) => {
							fs.unlinkSync(ranm)
							buff = fs.readFileSync(rano)
							if (err) return reply('Gagal om:(')
							client.sendMessage(from, buff, audio, {quoted: mek, ptt:true})
							fs.unlinkSync(rano)
						})
					})
					break
                                       } catch (err) { return reply('error') }
				case 'meme':
                                      try {
					meme = await kagApi.memes()
					buffer = await getBuffer(`https://imgur.com/${meme.hash}.jpg`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: '.......'})
					break
                                      } catch (err) { return reply('error') }
				case 'memeindo':
                                      try {
					memein = await kagApi.memeindo()
					buffer = await getBuffer(`https://imgur.com/${memein.hash}.jpg`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: '.......'})
					break
                                      } catch (err) { return reply('error') }
				case 'setprefix':
                                      try {
					if (args.length < 1) return
					if (!isOwner) return reply(mess.only.ownerB)
					prefix = args[0]
					reply(`Prefix berhasil di ubah menjadi : ${prefix}`)
					break
                                      } catch (err) { return reply('error') }
				case 'loli':
                                      try {
					//loli.getSFWLoli(async (err, res) => {
						return reply('❌ *ERROR* ❌')
						//buffer = await getBuffer(res.url)
						//client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Ingat! Citai Lolimu'})
					//})
					break
                                      } catch (err) { return reply('error') }
				case 'nsfwloli':
                                      try {
					//if (!isNsfw) return reply('❌ *FALSE* ❌')
					//loli.getNSFWLoli(async (err, res) => {
						return reply('❌ *ERROR* ❌')
					//	buffer = await getBuffer(res.url)
					//	client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Jangan jadiin bahan buat comli om'})
					//})
					break
                                      } catch (err) { return reply('error') }
				case 'hilih':
                                      try {
					if (args.length < 1) return reply('Teksnya mana um?')
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/hilih?teks=${body.slice(7)}`, {method: 'get'})
					reply(anu.result)
					break
                                     } catch (err) { return reply('error') }
				case 'yt2mp3':
                                      try {
					if (args.length < 1) return reply('Urlnya mana um?')
					if(!isUrl(args[0]) && !args[0].includes('youtu')) return reply(mess.error.Iv)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/yta?url=${args[0]}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = `*Title* : ${anu.title}\n*Filesize* : ${anu.filesize}`
					thumb = await getBuffer(anu.thumb)
					client.sendMessage(from, thumb, image, {quoted: mek, caption: teks})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, audio, {mimetype: 'audio/mp4', filename: `${anu.title}.mp3`, quoted: mek})
					break
                                      } catch (err) { return reply('error') }
				case 'ytsearch':
                                     try {
					if (args.length < 1) return reply('Yang mau di cari apaan? titit?')
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/ytsearch?q=${body.slice(10)}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = '=================\n'
					for (let i of anu.result) {
						teks += `*Title* : ${i.title}\n*Id* : ${i.id}\n*Published* : ${i.publishTime}\n*Duration* : ${i.duration}\n*Views* : ${h2k(i.views)}\n=================\n`
					}
					reply(teks.trim())
					break
                                     } catch (err) { return reply('error') }
				case 'tiktok':
                                      try {
					if (args.length < 1) return reply('Urlnya mana um?')
					if (!isUrl(args[0]) && !args[0].includes('tiktok.com')) return reply(mess.error.Iv)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/tiktok?url=${args[0]}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, video, {quoted: mek})
					break
                                      } catch (err) { return reply('error') }
				case 'tiktokstalk':
					try {
						if (args.length < 1) return client.sendMessage(from, 'Usernamenya mana um?', text, {quoted: mek})
						let { user, stats } = await tiktod.getUserProfileInfo(args[0])
						reply(mess.wait)
						teks = `*ID* : ${user.id}\n*Username* : ${user.uniqueId}\n*Nickname* : ${user.nickname}\n*Followers* : ${stats.followerCount}\n*Followings* : ${stats.followingCount}\n*Posts* : ${stats.videoCount}\n*Luv* : ${stats.heart}\n`
						buffer = await getBuffer(user.avatarLarger)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: teks})
					} catch (e) {
						console.log(`Error :`, color(e,'red'))
						reply('Kemungkinan username tidak valid')
					}
					break
				case 'nulis':
				case 'tulis':
					if (args.length < 1) return reply('Yang mau di tulis apaan?')
					teks = body.slice(7)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/nulis?text=${teks}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buff = await getBuffer(anu.result)
					client.sendMessage(from, buff, image, {quoted: mek, caption: mess.success})
					break
				case 'url2img':
					tipelist = ['desktop','tablet','mobile']
					if (args.length < 1) return reply('Tipenya apa um?')
					if (!tipelist.includes(args[0])) return reply('Tipe desktop|tablet|mobile')
					if (args.length < 2) return reply('Urlnya mana um?')
					if (!isUrl(args[1])) return reply(mess.error.Iv)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/url2image?tipe=${args[0]}&url=${args[1]}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buff = await getBuffer(anu.result)
					client.sendMessage(from, buff, image, {quoted: mek})
					break
				case 'tstiker':
				case 'tsticker':
					if (args.length < 1) return reply('Textnya mana um?')
					ranp = getRandom('.png')
					rano = getRandom('.webp')
					teks = body.slice(9).trim()
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/text2image?text=${teks}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					exec(`wget ${anu.result} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
						fs.unlinkSync(ranp)
						if (err) return reply(mess.error.stick)
						buffer = fs.readFileSync(rano)
						client.sendMessage(from, buffer, sticker, {quoted: mek})
						fs.unlinkSync(rano)
					})
					break
				case 'tagall':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `*#* @${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					mentions(teks, members_id, true)
					break
				case 'clearall':
                                      try {
					if (!isOwner) return reply('Kamu siapa?')
					anu = await client.chats.all()
					client.setMaxListeners(25)
					for (let _ of anu) {
						client.deleteChat(_.jid)
					}
					reply('Sukses delete all chat :)')
					break
                                      } catch (err) { return reply('error') }
				case 'bc':
                                      try {
					if (!isOwner) return reply('Kamu siapa?')
					if (args.length < 1) return reply('.......')
					anu = await client.chats.all()
					if (isMedia && !mek.message.videoMessage || isQuotedImage) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						buff = await client.downloadMediaMessage(encmedia)
						for (let _ of anu) {
							client.sendMessage(_.jid, buff, image, {caption: `[ Ini Broadcast ]\n\n${body.slice(4)}`})
						}
						reply('Suksess broadcast')
					} else {
						for (let _ of anu) {
							sendMess(_.jid, `[ Ini Broadcast ]\n\n${body.slice(4)}`)
						}
						reply('Suksess broadcast')
					}
					break
                                      } catch (err) { return reply('error') }
				case 'add':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (args.length < 1) return reply('Yang mau di add jin ya?')
					if (args[0].startsWith('08')) return reply('Gunakan kode negara mas')
					try {
						num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
						client.groupAdd(from, [num])
					} catch (e) {
						console.log('Error :', e)
						reply('Gagal menambahkan target, mungkin karena di private')
					}
					break
				case 'kick':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag target yang ingin di tendang!')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = 'Perintah di terima, mengeluarkan :\n'
						for (let _ of mentioned) {
							teks += `@${_.split('@')[0]}\n`
						}
						mentions(teks, mentioned, true)
						client.groupRemove(from, mentioned)
					} else {
						mentions(`Perintah di terima, mengeluarkan : @${mentioned[0].split('@')[0]}`, mentioned, true)
						client.groupRemove(from, mentioned)
					}
					break
				case 'listadmins':
					if (!isGroup) return reply(mess.only.group)
					teks = `List admin of group *${groupMetadata.subject}*\nTotal : ${groupAdmins.length}\n\n`
					no = 0
					for (let admon of groupAdmins) {
						no += 1
						teks += `[${no.toString()}] @${admon.split('@')[0]}\n`
					}
					mentions(teks, groupAdmins, true)
					break
				case 'toimg':
					if (!isQuotedSticker) return reply('❌ reply stickernya um ❌')
					reply(mess.wait)
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('❌ Gagal, pada saat mengkonversi sticker ke gambar ❌')
						buffer = fs.readFileSync(ran)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: '>//<'})
						fs.unlinkSync(ran)
					})
					break
				case 'simi':
					if (args.length < 1) return reply('Textnya mana um?')
					teks = body.slice(5)
					anu = await simih(teks) //fetchJson(`https://mhankbarbars.herokuapp.com/api/samisami?text=${teks}`, {method: 'get'})
					//if (anu.error) return reply('Simi ga tau kak')
					reply(anu)
					break
				case 'simih':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Hmmmm')
					if (Number(args[0]) === 1) {
						if (isSimi) return reply('Mode simi sudah aktif')
						samih.push(from)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('Sukses mengaktifkan mode simi di group ini ✔️')
					} else if (Number(args[0]) === 0) {
						samih.splice(from, 1)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('Sukes menonaktifkan mode simi di group ini ✔️')
					} else {
						reply('1 untuk mengaktifkan, 0 untuk menonaktifkan')
					}
					break
				case 'welcome':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Hmmmm')
					if (Number(args[0]) === 1) {
						if (isWelkom) return reply('Udah aktif um')
						welkom.push(from)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						reply('Sukses mengaktifkan fitur welcome di group ini ✔️')
					} else if (Number(args[0]) === 0) {
						welkom.splice(from, 1)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						reply('Sukses menonaktifkan fitur welcome di group ini ✔️')
					} else {
						reply('1 untuk mengaktifkan, 0 untuk menonaktifkan')
					}
				case 'clone':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Tag target yang ingin di clone')
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag cvk')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid[0]
					let { jid, id, notify } = groupMembers.find(x => x.jid === mentioned)
					try {
						pp = await client.getProfilePicture(id)
						buffer = await getBuffer(pp)
						client.updateProfilePicture(botNumber, buffer)
						mentions(`Foto profile Berhasil di perbarui menggunakan foto profile @${id.split('@')[0]}`, [jid], true)
					} catch (e) {
						reply('Gagal om')
					}
					break
				case 'wait':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						reply(mess.wait)
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						media = await client.downloadMediaMessage(encmedia)
						await wait(media).then(res => {
							client.sendMessage(from, res.video, video, {quoted: mek, caption: res.teks.trim()})
						}).catch(err => {
							reply(err)
						})
					} else {
						reply('Foto aja mas')
					}
					break
                                case 'matrixtext':
                                      if (args.length < 1) return reply('textnya mana sayang ?')
                                      reply(mess.wait)
                                      const res = await getBuffer(`https://api-anoncybfakeplayer.herokuapp.com/textpro/matrixtext?text=${encodeURIComponent(body.slice(12))}`)
                                      client.sendMessage(from,res,image,{quoted:mek,caption:`[!] Sukses membuat matrix text effect dengan text *${body.slice(12)}*`})
                                      break
                                case 'dropwatertext':
                                      if (args.length < 1) return reply('teksnya mana sayang?')
                                      reply(mess.wait)
                                      const suek = await getBuffer(`https://api-anoncybfakeplayer.herokuapp.com/textpro/dropwatertext?text=${encodeURIComponent(body.slice(15))}`)
                                      client.sendMessage(from,suek,image,{quoted:mek,caption:`[!] Sukses membuat drop water text effect dengan text *${body.slice(15)}*`})
                                      break
                                case 'anime':
                                      if (args.length < 1) return reply('anime apa yang mau dicari?')
                                      reply(mess.wait)
                                      const animek = await fetchJson(`https://api-anoncybfakeplayer.herokuapp.com/kusonime?q=${body.slice(7)}`)
                                      if (animek.error) return reply(animek.error)
                                      const res_animek = `Title: ${animek.title}\n\n${animek.info}\n\nSinopsis: ${animek.sinopsis}\n\nLink Download:\n${animek.link_dl}`
                                      const anim_thumb = await getBuffer(animek.thumb)
                                      client.sendMessage(from,anim_thumb,image,{quoted:mek,caption:res_animek})
                                      break
                                case 'tahta':
                                      if (args.length < 1) return reply('mana teksnya sayang ? ')
                                      reply(mess.wait)
                                      const tahta = await getBuffer(`https://api.vhtear.com/hartatahta?text=${encodeURIComponent(body.slice(7))}&apikey=Abil_Seno2k20`)
                                      client.sendMessage(from,tahta,image,{quoted:mek,caption:`[!] Sukses membuat harta tahta *${body.slice(7)}*`})
                                      break
                                case 'play':
                                     if (args.length < 1) return reply('apa yang mau di cari? titit? ')
                                     reply(mess.wait)
                                     const play = await fetchJson(`https://api.vhtear.com/ytmp3?query=${body.slice(6)}&apikey=Abil_Seno2k20`)
                                     if(play.result.error) return reply(`lagu tidak ditemukan!`)
                                     const play_thumb = await getBuffer(play.result.image)
                                     client.sendMessage(from,play_thumb,image,{quoted:mek,caption:`v. Title : ${play.result.title}\nv. Duration : ${play.result.duration}\nv. Size : ${play.result.size}\nv. Url : ${play.result.url}\n\nSedang dikirim...`})
                                     const play_audio = await getBuffer(play.result.mp3)
                                     client.sendMessage(from,play_audio,audio,{quoted:mek})
                                     break
                                case 'luxurytext':
                                      if (args.length < 1) return reply('teksnya mana sayang?')
                                      reply(mess.wait)
                                      const suek1 = await getBuffer(`https://api-anoncybfakeplayer.herokuapp.com/textpro/luxurytext?text=${encodeURIComponent(body.slice(12))}`)
                                      client.sendMessage(from,suek1,image,{quoted:mek,caption:`[!] Sukses membuat luxury text effect dengan text *${body.slice(12)}*`})
                                      break
                                case 'gluetext':
                                      if (args.length < 1) return reply('teksnya mana sayang?')
                                      reply(mess.wait)
                                      const suek2 = await getBuffer(`https://api-anoncybfakeplayer.herokuapp.com/textpro/gluetext?text=${encodeURIComponent(body.slice(10))}`)
                                      client.sendMessage(from,suek2,image,{quoted:mek,caption:`[!] Sukses membuat glue text effect dengan text *${body.slice(10)}*`})
                                      break
                                case 'ytmp3':
                                      if (args.length < 1) return reply(`Linknya mana sayang ? `)
                                      reply(mess.wait)
                                      const ytmp3 = await fetchJson(`https://api.vhtear.com/ytdl?link=${encodeURIComponent(body.slice(7))}&apikey=Abil_Seno2k20`)
                                      if(ytmp3.result.error) return reply(`Terjadi kesalahan, mungkin url yang dikirim tidak valid`)
                                      if(ytmp3.result.info) return reply(ytmp3.result.info)
                                      if(Number(ytmp3.result.size.split(' MB')[0]) >= 35.00) return reply(`Maaf, ukuran file sudah melebihi batas maksimal yaitu 35mb, sedangkan file berukuran ${ytmp3.result.size}`)
                                      const ytmp3_thumb = await getBuffer(ytmp3.result.imgUrl).catch(err => reply(`error`))
                                      client.sendMessage(from,ytmp3_thumb,image,{quoted:mek,caption:`-> Title : ${ytmp3.result.title}\n-> FileSize : ${ytmp3.result.size}\n\nSedang dikirim...`}).catch(err => reply(`error`))
                                      const ytmp3_audio = await getBuffer(ytmp3.result.UrlMp3).catch(err => reply(`error`))
                                      const titel = ytmp3.result.title
                                      client.sendMessage(from,ytmp3_audio,audio,{mimetype:'audio/mp4',filename:`${titel}.mp3`,quoted:mek}).catch(err => reply(`error`))
                                      break
                                case 'ytmp4':
                                      if (args.length < 1) return reply(`Linknya mana sayang ? `)
                                      reply(mess.wait)
                                      const ytmp4 = await fetchJson(`https://api.vhtear.com/ytdl?link=${encodeURIComponent(body.slice(7))}&apikey=Abil_Seno2k20`)
                                      if(ytmp4.result.error) return reply(`Terjadi kesalahan, mungkin url yang dikirim tidak valid`)
                                      if(ytmp4.result.info) return reply(ytmp4.result.info)
                                      if(Number(ytmp4.result.size.split(' MB')[0]) >= 35.00) return reply(`Maaf, ukuran file sudah melebihi batas maksimal yaitu 35mb, sedangkan file berukuran ${ytmp4.result.size}`)
                                      const ytmp4_thumb = await getBuffer(ytmp4.result.imgUrl).catch(err => reply(`error`))
                                      client.sendMessage(from,ytmp4_thumb,image,{quoted:mek,caption:`-> Title : ${ytmp4.result.title}\n-> FileSize : ${ytmp4.result.size}\n\nSedang dikirim...`}).catch(err => reply(`error`))
                                      const ytmp4_video = await getBuffer(ytmp4.result.UrlVideo).catch(err => reply('error'))
                                      const titel2 = ytmp4.result.title
                                      client.sendMessage(from,ytmp4_video,video,{mimetype:'video/mp4',filename:`${titel2}.mp4`,quoted:mek}).catch(err => reply('error'))
                                      break
                                case 'joox':
                                      if (args.length < 1) return reply(`apa yang mau dicari, tong ? `)
                                      reply(mess.wait)
                                      const joox = await fetchJson(`https://api.vhtear.com/music?query=${encodeURIComponent(body.slice(6))}&apikey=Abil_Seno2k20`)
                                      const joox_thumb = await getBuffer(joox.result[0].linkImg).catch(err => reply('error'))
                                      client.sendMessage(from,joox_thumb,image,{quoted:mek,caption:`-> Judul : ${joox.result[0].judul}\n-> Album : ${joox.result[0].album}\n-> Penyanyi : ${joox.result[0].penyanyi}\n-> Durasi : ${joox.result[0].duration}\n-> FileSize : ${joox.result[0].filesize}\n\nSedang dikirim...`}).catch(err => reply(`error`))
                                      const joox_mp3 = await getBuffer(joox.result[0].linkMp3)
                                      const titel3 = joox.result[0].judul
                                      client.sendMessage(from,joox_mp3,audio,{mimetype:'audio/mp4',filename:`${titel3}.mp3`,quoted:mek})
                                      break
                                case 'thundertext':
                                      if (args.length < 1) return reply('teksnya mana sayang ? ')
                                      reply(mess.wait)
                                      const thunder = await getBuffer(`https://api.vhtear.com/thundertext?text=${encodeURIComponent(body.slice(13))}&apikey=Abil_Seno2k20`)
                                      client.sendMessage(from,thunder,image,{quoted:mek,caption:`[!] Sukses membuat thunder text effects dengan text *${body.slice(13)}*`})
                                      break
                                case 'tomp3':
                                case 'toaudio':
                                      if ((isMedia && mek.message.videoMessage || isQuotedVideo) && args.length == 0){
                                       reply(mess.wait)
                                       const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
                                       const media = await client.downloadAndSaveMediaMessage(encmedia)
                                       const ran = getRandom('.mp3')
                                       converter.convert(media,ran,function (err) {
                                        if (err) throw err
                                        console.log(`Sukses menconvert ke ${ran}`)
                                        const buff = fs.readFileSync(ran)
                                        client.sendMessage(from,buff,audio,{quoted:mek,mimetype:'audio/mpeg',filename:`${ran}.mp3`})
                                        fs.unlinkSync(media)
                                        fs.unlinkSync(ran)
                                       })
                                      } else { return reply(`Untuk menconvert video menjadi audio/mp3\nKirim video dengan caption .tomp3, atau tag video yang sudah dikirim!`) }
                                      break
                                case 'twitter':
                                    try {
                                     if (args.length < 1) return reply('linknya mana sayang? ')
                                     reply(mess.wait)
                                     const tw = await fetchJson(`https://api.vhtear.com/twitter?link=${body.slice(9)}&apikey=Abil_Seno2k20`)
                                     if(tw.result.error) return reply(tw.result.error)
                                     const tw_vid = await getBuffer(tw.result.urlVideo)
                                     client.sendMessage(from,tw_vid,video,{quoted:mek,caption:tw.result.desk})
                                     break
                                    } catch (err) { return reply('error') }
                                case 'facebook':
                                    try {
                                     if (args.length < 1) return reply('linknya mana sayang ? ')
                                     reply(mess.wait)
                                     const fb = await fetchJson(`https://api.vhtear.com/fbdl?link=${body.slice(10)}&apikey=Abil_Seno2k20`)
                                     if(fb.result.VideoUrl.includes('Link video')) return reply('[!] URL yang dikirim tidak valid, atau di privasi')
                                     const fb_vid = await getBuffer(fb.result.VideoUrl)
                                     client.sendMessage(from,fb_vid,video,{quoted:mek,caption:'[!] Berhasil √'})
                                     break
                                   } catch (err) { return reply('error') }
                                case 'igstalk':
                                    try {
                                     if (args.length < 1) return reply('usernamenya manah ?? ')
                                     reply(mess.wait)
                                     const igs = await fetchJson(`https://api.vhtear.com/igprofile?query=${encodeURIComponent(body.slice(9))}&apikey=Abil_Seno2k20`)
                                     if (igs.result == null || igs.result == undefined) return reply('[!] Username salah !!')
                                     if (igs.result.is_private == true) { var privat = "Ya" }
                                     else if (igs.result.is_private == false) { var privat = "Tidak" }
                                     const igs_pic = await getBuffer(igs.result.picture)
                                     client.sendMessage(from,igs_pic,image,{quoted:mek,caption:`-> Username : @${igs.result.username}\n-> Nama : ${igs.result.full_name}\n-> Follower : ${igs.result.follower}\n-> Following : ${igs.result.follow}\n-> Jumlah Postingan : ${igs.result.post_count}\n-> Ini Private ? ${privat}`})
                                    } catch (err) { return reply('error') }
                                    break
                                case 'igdown':
                                   try {
                                    if (args.length < 1) return reply('mana linknya sayang ? ')
                                    reply(mess.wait)
                                    const igd = await fetchJson(`https://api.vhtear.com/instadl?link=${body.slice(8)}&apikey=Abil_Seno2k20`)
                                    reply(`-> Caption : ${igd.result.caption}\n-> Pengunggah : ${igd.result.owner_username}\n-> Jumlah Slide : ${igd.result.post.length}\n\nSedang dikirim...`)
                                    for (let igd_post of igd.result.post){
                                     const igd_buff = await getBuffer(igd_post.urlDownload)
                                     if(igd_post.type == "image") {
                                      client.sendMessage(from,igd_buff,image,{quoted:mek,caption:`-> Type : ${igd_post.type}`})
                                     } else { client.sendMessage(from,igd_buff,video,{quoted:mek,caption:`-> Type : ${igd_post.type}`}) }
                                    }
                                   } catch (err) {
                                    console.log(err)
                                    return reply('error')
                                   }
                                   break
                                case 'igstory':
                                   try {
                                    if (args.length < 1) return reply('usernamenya mana sayang?')
                                    reply(mess.wait)
                                    if (args.length === 1){
                                     const igs1 = await fetchJson(`https://api.vhtear.com/igstory?query=${encodeURIComponent(args[0])}&apikey=Abil_Seno2k20`)
                                     if (igs1.result.status == "error message") return reply(`[!] Username salah!!`)
                                     if (igs1.result.story.itemlist == undefined || igs1.result.story.itemlist == null) return reply(`[!] Username yang dituju tidak memiliki story`)
                                     igs_cap = `Saya menemukan *${igs1.result.story.itemlist.length}* story, di username *${igs1.result.owner_username}*\n=================\n`
                                     no = 0
                                     for (let mmk of igs1.result.story.itemlist){
                                      igs_cap += `-> Type : ${mmk.type}\n-> Untuk mendownload : *.igstory ${igs1.result.owner_username} ${no}*\n=================\n`
                                      no += 1
                                     }
                                     reply(igs_cap)
                                    } else if (args.length === 2) {
                                      const igs1 = await fetchJson(`https://api.vhtear.com/igstory?query=${args[0]}&apikey=Abil_Seno2k20`)
                                      if (igs1.result.status == "error message") return reply(`[!] Username salah!!`)
                                      if (igs1.result.story.itemlist == undefined || igs1.result.story.itemlist == null) return reply(`[!] Username yang dituju tidak memiliki story`)
                                      try {
                                       const igs1_buff = await getBuffer(igs1.result.story.itemlist[Number(args[1])].urlDownload)
                                       if(igs1.result.story.itemlist[Number(args[1])].type == "video") return client.sendMessage(from,igs1_buff,video,{quoted:mek,caption:`[!] Berhasil ✓\n-> Nomor : ${args[1]}`})
                                       if(igs1.result.story.itemlist[Number(args[1])].type == "image") return client.sendMessage(from,igs1_buff,image,{quoted:mek,caption:`[!] Berhasil ✓\n-> Nomor : ${args[1]}`})
                                      } catch (err) { return reply(`[!] Story dengan nomor *${args[1]}* tidak tersedia di username *${args[0]}*`) }
                                   } else { return reply(`Format salah!`) }
                                   } catch (err) {
                                     console.log(err)
                                     return reply('error')
                                   }
                                     break
                                case 'igtv':
                                  try {
                                   if (args.length < 1) return reply(`usernamenya mana sayang ? `)
                                   reply(mess.wait)
                                   if (args.length === 1){
                                    const igtv = await fetchJson(`https://api.vhtear.com/igtv?query=${encodeURIComponent(args[0])}&apikey=Abil_Seno2k20`)
                                    if(igtv.toString().includes('error message')) return reply('[!] Username salah!')
                                    if(igtv.result.igTv.length === 0) return reply(`[!] Username yang dituju tidak memiliki igtv!`)
                                    igtv_cap = `Saya menemukan *${igtv.result.igTv.length}* instagram tv, di username *${args[0]}*\n=================\n`
                                    no = 0
                                    for (let kntl of igtv.result.igTv){
                                     igtv_cap += `-> Nomor : ${no}\n-> Untuk mendownload : *.igtv ${args[0]} ${no}*\n=================\n`
                                     no += 1
                                    }
                                    reply(igtv_cap)
                                   } else if(args.length === 2){
                                     const igtv = await fetchJson(`https://api.vhtear.com/igtv?query=${encodeURIComponent(args[0])}&apikey=Abil_Seno2k20`)
                                     if(igtv.toString().includes('error message')) return reply('[!] Username salah!')
                                     if(igtv.result.igTv.length === 0) return reply(`[!] Username yang dituju tidak memiliki igtv!`)
                                     try {
                                      const igtv_thumb = await getBuffer(igtv.result.igTv[Number(args[1])].urlImage)
                                      client.sendMessage(from,igtv_thumb,image,{quoted:mek,caption:`-> Caption : ${igtv.result.igTv[Number(args[1])].caption}`})
                                      const igtv_vid = await getBuffer(igtv.result.igTv[Number(args[1])].urlVideo)
                                      client.sendMessage(from,igtv_vid,video,{quoted:mek,caption:`[!] Berhasil ✓\n-> Nomor : ${args[1]}`})
                                     } catch (err) { 
                              console.log(err)
                              return reply(`[!] IgTv dengan nomor *${args[1]}*, tidak ditemukan di username *${args[0]}*`) 
                                     }
                                   } else { return reply(`[!] Format salah!!`) }
                                 } catch (err) {
                                    console.log(err)
                                   return reply('error')
                                 }
                                   break
                                case 'callingmeme':
                                  if (args.length < 1) return reply(`teksnya mana um ? `)
                                  reply(mess.wait)
                                  const call = await fetch(`https://api.alexflipnote.dev/calling?text=${encodeURIComponent(body.slice(13))}`,{headers:cnfig})
                                  const buffer3 = await call.buffer()
                                  client.sendMessage(from,buffer3,image,{quoted:mek,caption:`[!] Sukses membuat calling meme dengan text *${body.slice(13)}*`})
                                  break
                                case 'drakememe':
                                  if (args.length < 1) return reply(`textnya mana um ? `)
                                  reply(mess.wait)
                                  const drake = await fetch(`https://api.alexflipnote.dev/drake?top=${args[0]}&bottom=${args[1]}`,{headers:cnfig})
                                  const buffer4 = await drake.buffer()
                                  client.sendMessage(from,buffer4,image,{quoted:mek,caption:`[!] Sukses membuat drake meme dengan text1 *${args[0]}* dan text2 *${args[1]}*`})
                                  break
				default:
					if (isGroup && isSimi && budy != undefined) {
						console.log(budy)
						muehe = await simih(budy)
						console.log(muehe)
						reply(muehe)
					} else {
						console.log(color('[ERROR]','red'), 'Unregistered Command from', color(sender.split('@')[0]))
					}
                           }
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
}
starts()
