class Musica {
	constructor() {
		if (new.target == Musica)
			throw TypeError("Esta class não pode ser instanciada.")
	}

	static onLoad() {
		this._setupHandlers()
		this.mostrarSugestoes()
	}

	static _setupHandlers() {
		document.querySelector("#fm_song").addEventListener("submit", this.fmLoadPlaylistHandle)
	}

	static YTAPIReady() {
		player = new YT.Player('player', {
			// height: '1',
			// width: '1',
			events: {
				'onReady': this._onPlayerReady,
				'onStateChange': this._onPlayerStateChange,
				'onError': this._onPlayerError.bind(this)
			}
		});
	}

	static _onPlayerReady() {
		document.querySelector("#fm_song fieldset").disabled = false
		player.setVolume(100)
		player.setPlaybackQuality('small')
	}

	static _onPlayerStateChange(e) {
		// document.querySelector("#btn_play_pause").value = e.data == YT.PlayerState.PLAYING ? "Pausar" : e.data == YT.PlayerState.BUFFERING ? "Carregando" : "Reproduzir"
	
		// document.querySelector("#btn_play_pause").disabled = e.data == YT.PlayerState.BUFFERING
	}

	static _onPlayerError(e) {
		this.nextSongHandle()
		switch (e.data) {
			case 2:
				throw Error("Erro no player do YouTube: A solicitação contém um valor de parâmetro inválido. Por exemplo, este erro ocorre se você especificar um ID de vídeo que não tem 11 caracteres, ou se o ID de vídeo contém caracteres inválidos, como pontos de exclamação ou asteriscos.")
			case 5:
				throw Error("Erro no player do YouTube: O conteúdo solicitado não pode ser reproduzido em um player HTML5, ou ocorreu outro erro relacionado ao player HTML5.")
			case 100:
				throw Error("Erro no player do YouTube: O vídeo solicitado não foi encontrado. Esse erro ocorrerá quando um vídeo tiver sido removido (por qualquer motivo) ou marcado como privado.")
			case 101:
			case 150:
				throw Error("Erro no player do YouTube: O proprietário do vídeo solicitado não permite que ele seja reproduzido em players incorporados.")
			default:
				throw Error("Ocorrou um erro desconhecido no player do YouTube.")
		}
	}

	static fmLoadPlaylistHandle() {
		document.querySelector("#fm_song > fieldset").disabled = true;
				
		document.querySelector("#playlist_details").classList.add("hide");
		document.querySelector("#playlist_details > header p span").classList.add("hide");
		document.querySelector("#playlist_details > article").classList.add("hide");

		const ipt_element = document.querySelector("#ipt_playlist_url"),
			url = new URL(ipt_element.value),
			searchParams = new URLSearchParams(url.search),
			playlist_id = searchParams.get('list'),
			index_playing = searchParams.get('index'),
			video_id = searchParams.get('v')

		if (playlist_id) {
			Musica._loadPlaylistInfo(playlist_id)

			player.loadPlaylist({
				list: playlist_id,
				index: index_playing || 0
			})
			player.setLoop(true)
		} else if (video_id) {
			Musica._loadVideoInfo(video_id)

			player.loadVideoById({
				videoId: video_id
			})
		}
	}

	static _loadPlaylistInfo(playlist_id) {
		fetch(`${YT_API_ENDPOINT_BASE}playlists?key=${YT_API_KEY}&part=snippet&id=${playlist_id}`)
			.then(response => response.json())
			.then(data => {
				const playlist_data = data.items[0].snippet

				document.querySelector("#playlist_details h2").innerText = playlist_data.title

				document.querySelector("#playlist_details p a").href = `https://www.youtube.com/channel/${playlist_data.channelId}`
				document.querySelector("#playlist_details p a").innerText = playlist_data.channelTitle
				
				document.querySelector("#playlist_details").classList.remove("hide");
			})
			.catch(err => {
				console.error(err)
			})
			.then(() => {
				document.querySelector("#fm_song > fieldset").disabled = false;
			})

		fetch(`${YT_API_ENDPOINT_BASE}playlistItems?key=${YT_API_KEY}&part=snippet&playlistId=${playlist_id}`)
			.then(response => response.json())
			.then(data => {
				if (data.error) throw data.error
				console.log(data)

				const indexNow = document.querySelector("#playlist_details header p span span:first-child"),
					totalIndex = document.querySelector("#playlist_details header p span span:last-child")

				indexNow.innerText = 1
				totalIndex.innerText = data.pageInfo.totalResults

				document.querySelector("#playlist_details header p span").classList.remove("hide")

				const playlist_videos = data.items

				const videos_list = []
				playlist_videos.forEach(video => {
					videos_list.push({
						id: video.snippet.resourceId.videoId,
						position: video.snippet.position,
						thumbnail: video.snippet.thumbnails.default.url,
						title: video.snippet.title,
						channelTitle: video.snippet.channelTitle
					})
				})


				const ul = document.querySelector("#playlist_details article ul")
				ul.innerHTML = ""
				videos_list.forEach(video => {

					const li = document.createElement("li")
					const a = document.createElement("a")
					a.href = "#"

					const position = document.createElement("span")
					position.innerText = video.position
					a.appendChild(position) // ▶

					const img = document.createElement("img")
					img.src = video.thumbnail
					img.alt = "video thumbnail"
					a.appendChild(img)

					const div = document.createElement("div")

					const title = document.createElement("h3")
					title.innerText = video.title
					div.appendChild(title)

					const channel = document.createElement("span")
					channel.innerText = video.channelTitle
					div.appendChild(channel)

					a.appendChild(div)
					li.appendChild(a)
					ul.appendChild(li)
				})

				document.querySelector("#playlist_details > article").classList.remove("hide");
			})
			.catch(err => {
				console.error(err)
			})
	}

	static _loadVideoInfo(video_id) {

	}

	static _escolherSugestoes() {
		const salvas = [
			{
				label: 'Sacudida eletrônica • YouTube Music',
				url: 'https://www.youtube.com/watch?list=RDCLAK5uy_kkuspkIN8uIjVQhha24N8FzzmvfUSVie0&disable_polymer=true'
			},
			// {
			// 	label: 'Pop Up: estímulo pop • YouTube Music',
			// 	url: 'https://www.youtube.com/watch?list=RDCLAK5uy_l_1tz0QYbDY4ZRw3uH0dyZugjHHgyGhDM&disable_polymer=true'
			// },
			{
				label: 'Motivação indie • YouTube Music',
				url: 'https://www.youtube.com/watch?list=RDCLAK5uy_kJugFGmnxlc9Q3qDpFBM3SzFbQHrnvL2w&disable_polymer=true'
			},
			{
				label: 'WS • EPiC UFSCar',
				url: 'https://www.youtube.com/watch?list=PLoQw91AtL5hZrI5W9oqhvXzPwgp6jva-x&disable_polymer=true'
			}
		]

		const escolhidas = []
		for (let i = 0; i < 3; i++) {
			const sugestao = salvas[Math.floor(Math.random() * salvas.length)]

			if (escolhidas.indexOf(sugestao) == -1) {
				escolhidas.push(sugestao)
			} else {
				i--;
			}
		}
		return escolhidas;
	}

	static mostrarSugestoes() {
		document.querySelectorAll("#playlists li").forEach(e => e.parentElement.removeChild(e))

		const sugestoes = this._escolherSugestoes();

		sugestoes.forEach(s => {
			const url = new URL(s.url),
			searchParams = new URLSearchParams(url.search),
			// playlist_id = searchParams.get('list'),
			video_id = searchParams.get('v')

			const set_url_handler = () => {
				document.querySelector("#ipt_playlist_url").value = s.url
			}

			const li_element = document.createElement("li")
			li_element.classList.add("sugestao_item")
			li_element.addEventListener("click", set_url_handler)

			var li_class, fa_icon
			if (video_id !== null) {
				li_class = "song"
				fa_icon = document.querySelector("#sugestoes > .icones_clonaveis > span:last-child").cloneNode(true)
			} else {
				li_class = "playlist"
				fa_icon = document.querySelector("#sugestoes > .icones_clonaveis > span:first-child").cloneNode(true)
			}

			li_element.classList.add(li_class)
			li_element.appendChild(fa_icon)

			const span_element = document.createElement("span")
			span_element.innerText = s.label
			li_element.appendChild(span_element)

			document.querySelector("#sugestoes").appendChild(li_element)
		});
	}

	static prevSongHandle() {
		player.previousVideo()
	}
	static playSongHandle() {
		if (player.getPlayerState() != YT.PlayerState.PLAYING) {
			player.playVideo()
		}
	}
	static pauseSongHandle() {
		if (player.getPlayerState() == YT.PlayerState.PLAYING) {
			player.pauseVideo()
		}
	}
	static nextSongHandle() {
		player.nextVideo()
	}
}
var player;
const YT_API_ENDPOINT_BASE = "https://www.googleapis.com/youtube/v3/"
const YT_API_KEY = "AIzaSyAC7T2lo7i_HkV5enRkDiAKWgLGJFnm2nU"