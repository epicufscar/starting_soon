window.onload = () => {
	document.querySelectorAll("form").forEach(element => {
		element.addEventListener("submit", e => 	e.preventDefault())
	})
	
	document.querySelector("#fm_info").addEventListener("change", fmInfoHandle)
	
	document.querySelector("#fm_time").addEventListener("submit", fmTimeHandle)
	
	document.querySelector("#fm_add_time").addEventListener("submit", fmAddTimeHandle)
	
	document.querySelector("#fm_song").addEventListener("submit", fmLoadPlaylistHandle)

	document.querySelector("#fm_theme").addEventListener("change", fmThemeHandle)

	// document.querySelector("#btn_prev").addEventListener("click", prevSongHandle)
	// document.querySelector("#btn_play_pause").addEventListener("click", playPauseSongHandle)
	// document.querySelector("#btn_next").addEventListener("click", nextSongHandle)

	document.querySelector("#s_count").innerText = count_text
	document.querySelector("#s_count").setAttribute("data-text", count_text)

	document.querySelector("#btn_exit_config").addEventListener("click", atalhoFecharConfigHandle)
	document.querySelector("#btn_open_config").addEventListener("click", atalhoAbrirConfigHandle)
	atalhoAbrirConfigHandle()

	document.querySelectorAll("#fm_atal input").forEach(element => {
		element.addEventListener("focusin", iptAlterarAtalhoHandleOnFocusIn)
		element.addEventListener("focusout", iptAlterarAtalhoHandleOnFocusOut)
	})

	Musica.mostrarSugestoes()
}
const count_text = "Começaremos em breve!"

const fmAddTimeHandle = () => {
	clearTimeout(endTimeMessage) // Precisa parar o timeout aqui pois quando chamar o stopCoolDown, ele criará um novo timeout e o anterior continuará sendo executado mesmo que o novo seja parado dentro do fmTimeHandle
	stopCoolDown()
	
	const ipt_data = document.querySelector("#ipt_time_2_add").value.split(":"),
	ipt_hour = Number(ipt_data[0]),
	ipt_minute = Number(ipt_data[1]),
	previous_end_data = document.querySelector("#ipt_time_2_end").value.split(":"),
	previous_hour = previous_end_data[0] != "" ? Number(previous_end_data[0]) : new Date().getHours(),
	previous_minute = previous_end_data[1] ? Number(previous_end_data[1]) : new Date().getMinutes(),
	new_hour = (previous_hour + ipt_hour + Math.floor((previous_minute + ipt_minute) / 60)) % 24,
	new_minute = (previous_minute + ipt_minute) % 60,
	new_end_data = `${String(new_hour).padStart(2, 0)}:${String(new_minute).padStart(2, 0)}`
	
	document.querySelector("#ipt_time_2_add").value = ""
	document.querySelector("#ipt_time_2_end").value = new_end_data
	document.querySelector("#btn_start_stop_time").click()
}

const fmInfoHandle = e => {
	e.preventDefault()
	
	const ids = {
		'ipt_org': 'h_org',
		'ipt_title': 'h_title'
	}
	
	document.querySelector(`#${ids[e.target.id]}`).innerHTML = e.target.value
	document.querySelector(`#${ids[e.target.id]}`).setAttribute("data-text", e.target.value)
}

var countInterval = null,
endTimeMessage = null
const fmTimeHandle = e => {
	e.preventDefault()
	
	if (!countInterval) {
		const now = new Date(),
		ipt_data = e.target.ipt_time_2_end.value.split(":"),
		ipt_hour = Number(ipt_data[0]),
		ipt_minute = Number(ipt_data[1]),
		estimed_end = new Date(new Date().setHours(ipt_hour, ipt_minute, 0))
		
		if (now > estimed_end) {
			estimed_end.setDate(now.getDate()+1)
		}
		
		clearTimeout(endTimeMessage)
		countInterval = setInterval(coolDown, 10, estimed_end)
		
		e.target.ipt_time_2_end.disabled = true;
		document.querySelector("#btn_start_stop_time").value = "Parar"
	} else {
		stopCoolDown()
	}
}

const stopCoolDown = () => {
	clearInterval(countInterval)
	countInterval = null
	document.querySelector("#btn_start_stop_time").value = "Começar"
	document.querySelector("#ipt_time_2_end").disabled = false;
	endTimeMessage = setTimeout(() => {
		document.querySelector("#s_count").innerText = count_text
		document.querySelector("#s_count").setAttribute("data-text", count_text)
	}, 5000)
}

const coolDown = end => {
	const now = new Date(),
	left = {
		hours: Math.floor(Math.abs(end - now) / 36e5).toFixed(0).padStart(2, 0),
		minutes: (Math.floor(Math.abs(end - now) / 6e4) % 60).toFixed(0).padStart(2, 0),
		seconds: (Math.floor(Math.abs(end - now) / 1e3) % 60).toFixed(0).padStart(2, 0)
	}
	
	const text = `<b>${left.hours}</b>:${left.minutes}:<i>${left.seconds}</i>`
	document.querySelector("#s_count").innerHTML = text
	document.querySelector("#s_count").setAttribute("data-text", text.replace(/<\/?[^>]+(>|$)/g, ""))
	
	if (end <= now) stopCoolDown()
}

var player;
const fmLoadPlaylistHandle = () => {
	const ipt_element = document.querySelector("#ipt_playlist_url"),
		url = new URL(ipt_element.value),
		searchParams = new URLSearchParams(url.search),
		playlist_id = searchParams.get('list'),
		index_playing = searchParams.get('index'),
		video_id = searchParams.get('v')

	if (playlist_id) {
		player.loadPlaylist({
			list: playlist_id,
			index: index_playing || 0
		})
		player.setLoop(true)

		// document.querySelector("#btn_prev").disabled = false
		// document.querySelector("#btn_next").disabled = false
	} else if (video_id) {
		player.loadVideoById({
			videoId: video_id
		})
		//TODO: setLoop é apenas para listas
		//player.setLoop(true)

		// document.querySelector("#btn_prev").disabled = true
		// document.querySelector("#btn_next").disabled = true
	}
}

function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		// height: '1',
		// width: '1',
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange,
			'onError': onPlayerError
		}
	});
}
function onPlayerReady() {
	document.querySelector("#fm_song fieldset").disabled = false
	player.setVolume(100)
	player.setPlaybackQuality('small')
}
function onPlayerStateChange(e) {
	// document.querySelector("#btn_play_pause").value = e.data == YT.PlayerState.PLAYING ? "Pausar" : e.data == YT.PlayerState.BUFFERING ? "Carregando" : "Reproduzir"

	// document.querySelector("#btn_play_pause").disabled = e.data == YT.PlayerState.BUFFERING
}
function onPlayerError(e) {
	nextSongHandle()
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

const prevSongHandle = () => {
	player.previousVideo()
}
const playSongHandle = () => {
	if (player.getPlayerState() != YT.PlayerState.PLAYING) {
		player.playVideo()
	}
}
const pauseSongHandle = () => {
	if (player.getPlayerState() == YT.PlayerState.PLAYING) {
		player.pauseVideo()
	}
}
const nextSongHandle = () => {
	player.nextVideo()
}

const fmThemeHandle = e => {
	const theme_name = e.target.value,
		style_id = "theme_style",
		script_id = "theme_script"

	let style = document.head.querySelector(`#${style_id}`),
		script = document.head.querySelector(`#${script_id}`)

	if (theme_name != "none") {
		if (style === null) {
			style = document.createElement("link")
			style.setAttribute("rel", "stylesheet")
			style.setAttribute("type", "text/css")
			style.setAttribute("id", style_id)
			document.head.appendChild(style)
		}

		style.setAttribute("href", `themes/${theme_name}/${theme_name}.css`)
		
		if (script === null) {
			script = document.createElement("script")
			script.setAttribute("id", script_id)
			document.head.appendChild(script)
		}

		script.setAttribute("src", `themes/${theme_name}/${theme_name}.css`)
	} else {
		if (style !== null) style.parentElement.removeChild(style)
		if (script !== null) script.parentElement.removeChild(script)
	}
}