import Music from "./music.js"

// Configurações do HOTKEYS
hotkeys.filter = function(event) {
	var tagName = (event.target || event.srcElement).tagName
	return !(tagName.isContentEditable || tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA') || event.key == "Escape" || HotKeys.gravando
}

var HotKeys = {};
(function() {
	this.gravando = null

	var atalhos = {},
		novos_atalhos = {},
		THIS = this

	this.Handlers = {};
	(function() {
		this.iptAlterarAtalhoHandleOnFocusIn = e => {
			THIS.gravando = e.target
			e.target.classList.add("gravando")
			hotkeys.setScope("gravando")
		}
		this.iptAlterarAtalhoHandleOnFocusOut = e => {
			THIS.gravando = null
			e.target.classList.remove("gravando")
			hotkeys.setScope("config")

			DefinirAtalhos.definirTodos()
		}
		
		this.atalhoFecharConfigHandler = () => {
			const details = document.querySelector("details")
			if (details.hasAttribute("open")) {
				document.querySelector("summary").click()
				hotkeys.setScope('main')

				window.location = "#"
			}
		}
		this.atalhoAbrirConfigHandler = (focar = true) => {
			const details = document.querySelector("details")
			if (!details.hasAttribute("open")) {
				document.querySelector("summary").click()
				hotkeys.setScope('config')

				// if (focar) focarNoElemento("input")
			}
		}
		
		this.atalhoMenuNavHandler = (link_id_ref) => {
			if (THIS.gravando) return
			if (hotkeys.getScope() == "main")
				this.atalhoAbrirConfigHandler(false)
			document.querySelector(`*[href='${link_id_ref}']`).click()
			focarNoElemento(`${link_id_ref} input`)
		}
		const focarNoElemento = query => {
			// Para o evento não ser passado pro input
			setTimeout(() => document.querySelector(query).focus(), 0)
		}
	}).apply(this.Handlers)

	this.init = () => {
		hotkeys("*", 'gravando', capturarTeclas)
		criarAtalhosPadrao()
		DefinirAtalhos.definirTodos()
	}

	const capturarTeclas = e => {
		if (THIS.gravando) {
			THIS.gravando.value = hotkeys.getPressedKeyCodes().map(e => e = keyCodes[e]).join("+").toLowerCase()
			atalhos[THIS.gravando.getAttribute("data-atalho")] = THIS.gravando.value
			e.preventDefault()
		}
	}

	const criarAtalhosPadrao = () => {
		Object.defineProperty(atalhos, "_abrirConfig", { value: "o", writable: false, enumerable: true, configurable: false })
		Object.defineProperty(atalhos, "_fecharConfig", { value: "esc", writable: false, enumerable: true, configurable: false })
	
		Object.defineProperty(atalhos, "_detacarInfo", { value: "i", writable: false, enumerable: true, configurable: false })
		Object.defineProperty(atalhos, "_detacarCont", { value: "c", writable: false, enumerable: true, configurable: false })
		Object.defineProperty(atalhos, "_detacarMusi", { value: "m", writable: false, enumerable: true, configurable: false })
		Object.defineProperty(atalhos, "_detacarTema", { value: "t", writable: false, enumerable: true, configurable: false })
		Object.defineProperty(atalhos, "_detacarAtal", { value: "a", writable: false, enumerable: true, configurable: false })
	
		Object.defineProperty(atalhos, "_tocarMusica", { value: "ctrl+down", writable: false, enumerable: true, configurable: false })
		Object.defineProperty(atalhos, "_pausarMusica", { value: "ctrl+down", writable: false, enumerable: true, configurable: false })
		Object.defineProperty(atalhos, "_musicaAnterior", { value: "ctrl+left", writable: false, enumerable: true, configurable: false })
		Object.defineProperty(atalhos, "_proximaMusica", { value: "ctrl+right", writable: false, enumerable: true, configurable: false })
	}

	var DefinirAtalhos = {};
	(function() {
		this.definirTodos = () => {
			// Escopo ALL
			definirAtalhoMenuNav(atalhos._detacarInfo, 'all', "#config_info", "#ipt_keyword_edit_info")
			definirAtalhoMenuNav(atalhos._detacarCont, 'all', "#config_count", "#ipt_keyword_edit_count")
			definirAtalhoMenuNav(atalhos._detacarMusi, 'all', "#config_song", "#ipt_keyword_edit_music")
			definirAtalhoMenuNav(atalhos._detacarTema, 'all', "#config_tema", "#ipt_keyword_edit_theme")
			definirAtalhoMenuNav(atalhos._detacarAtal, 'all', "#config_atal", "#ipt_keyword_edit_hotkey")
			
			definirAtalhoTocarMusica()
			definirAtalhoPausarMusica()
			definirAtalhoMusicaAnterior()
			definirAtalhoProximaMusica()
		
			// Escopo MAIN
			definirAtalhoAbreConfig()
		
			// Escopo CONFIG
			definirAtalhoFechaConfig()
		}
		
		function definirAtalhoMenuNav(key, scope, link_id_ref, ipt_id_ref) {
			hotkeys(key, scope, () => THIS.Handlers.atalhoMenuNavHandler(link_id_ref))
			atualizarAtalhoNoInput(ipt_id_ref, key)
		}
		
		const atualizarAtalhoNoInput = (selector, key) => {
			document.querySelector(selector).value = String(key).toLowerCase()
		}
		
		const definirAtalhoTocarMusica = () => {
			const key = atalhos.tocarMusica || atalhos._tocarMusica
			hotkeys(key, Music.Handlers.playSongHandler)
			atualizarAtalhoNoInput("#ipt_keyword_play_music", key)
		}
		const definirAtalhoPausarMusica = () => {
			const key = atalhos.pausarMusica || atalhos._pausarMusica
			hotkeys(key, Music.Handlers.pauseSongHandler)
			atualizarAtalhoNoInput("#ipt_keyword_pause_music", key)
		}
		const definirAtalhoMusicaAnterior = () => {
			const key = atalhos.musicaAnterior || atalhos._musicaAnterior
			hotkeys(key, Music.Handlers.prevSongHandler)
			atualizarAtalhoNoInput("#ipt_keyword_prev_music", key)
		}
		const definirAtalhoProximaMusica = () => {
			const key = atalhos.proximaMusica || atalhos._proximaMusica
			hotkeys(key, Music.Handlers.nextSongHandler)
			atualizarAtalhoNoInput("#ipt_keyword_next_music", key)
		}
		const definirAtalhoAbreConfig = () => {
			const key = atalhos.abrirConfig || atalhos._abrirConfig
			hotkeys(key, "main", () => THIS.Handlers.atalhoAbrirConfigHandler(false))
			atualizarAtalhoNoInput("#ipt_keyword_open_config", key)
		}
		const definirAtalhoFechaConfig = () => {
			const key = atalhos.fecharConfig || atalhos._fecharConfig
			hotkeys(key, "config", THIS.Handlers.atalhoFecharConfigHandler)
			atualizarAtalhoNoInput("#ipt_keyword_close_config", key)
			document.querySelector("#btn_exit_config ~ span").innerText = String(key).toUpperCase()
		}

	}).apply(DefinirAtalhos)
}).apply(HotKeys)

export default HotKeys