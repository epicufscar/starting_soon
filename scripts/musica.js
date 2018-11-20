class Musica {
	constructor() {
		if (new.target == Musica)
			throw TypeError("Esta class não pode ser instanciada.")
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
}