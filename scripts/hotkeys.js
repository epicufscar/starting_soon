// Configurações do HOTKEYS
hotkeys.filter = function(event) {
	var tagName = (event.target || event.srcElement).tagName
	return !(tagName.isContentEditable || tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA') || event.key == "Escape" || gravando
}

const capturarTeclas = e => {
	if (gravando) {
		gravando.value = hotkeys.getPressedKeyCodes().map(e => e = keyCodes[e]).join("+").toLowerCase()
		atalhos[gravando.getAttribute("data-atalho")] = gravando.value
		e.preventDefault()
	}
}
hotkeys("*", 'gravando', capturarTeclas)

// ATALHOS
var atalhos = {}, novos_atalhos = {}
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
criarAtalhosPadrao()

const definirTodosAtalhos = () => {
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

const definirAtalhoTocarMusica = () => {
	const key = atalhos.tocarMusica || atalhos._tocarMusica
	hotkeys(key, Musica.playSongHandle)
	atualizarAtalhoNoInput("#ipt_keyword_play_music", key)
}
const definirAtalhoPausarMusica = () => {
	const key = atalhos.pausarMusica || atalhos._pausarMusica
	hotkeys(key, Musica.pauseSongHandle)
	atualizarAtalhoNoInput("#ipt_keyword_pause_music", key)
}
const definirAtalhoMusicaAnterior = () => {
	const key = atalhos.musicaAnterior || atalhos._musicaAnterior
	hotkeys(key, Musica.prevSongHandle)
	atualizarAtalhoNoInput("#ipt_keyword_prev_music", key)
}
const definirAtalhoProximaMusica = () => {
	const key = atalhos.proximaMusica || atalhos._proximaMusica
	hotkeys(key, Musica.nextSongHandle)
	atualizarAtalhoNoInput("#ipt_keyword_next_music", key)
}
const definirAtalhoAbreConfig = () => {
	const key = atalhos.abrirConfig || atalhos._abrirConfig
	hotkeys(key, "main", () => atalhoAbrirConfigHandle(false))
	atualizarAtalhoNoInput("#ipt_keyword_open_config", key)
}
const definirAtalhoFechaConfig = () => {
	const key = atalhos.fecharConfig || atalhos._fecharConfig
	hotkeys(key, "config", atalhoFecharConfigHandle)
	atualizarAtalhoNoInput("#ipt_keyword_close_config", key)
	document.querySelector("#btn_exit_config ~ span").innerText = String(key).toUpperCase()
}

function definirAtalhoMenuNav(key, scope, link_id_ref, ipt_id_ref) {
	hotkeys(key, scope, () => atalhoMenuNavHandle(link_id_ref))
	atualizarAtalhoNoInput(ipt_id_ref, key)
}
function atalhoMenuNavHandle(link_id_ref) {
	if (gravando) return
	if (hotkeys.getScope() == "main")
		atalhoAbrirConfigHandle(false)
	document.querySelector(`*[href='${link_id_ref}']`).click()
	focarNoElemento(`${link_id_ref} input`)
}

function atalhoFecharConfigHandle() {
	const details = document.querySelector("details")
	if (details.hasAttribute("open")) {
		document.querySelector("summary").click()
		hotkeys.setScope('main')

		window.location = "#"
	}
}
function atalhoAbrirConfigHandle(focar = true) {
	const details = document.querySelector("details")
	if (!details.hasAttribute("open")) {
		document.querySelector("summary").click()
		hotkeys.setScope('config')

		// if (focar) focarNoElemento("input")
	}
}

const focarNoElemento = query => {
	// Para o evento não ser passado pro input
	setTimeout(() => document.querySelector(query).focus(), 0)
}

const atualizarAtalhoNoInput = (selector, key) => {
	document.querySelector(selector).value = String(key).toLowerCase()
}

var gravando = null
const iptAlterarAtalhoHandleOnFocusIn = e => {
	gravando = e.target
	e.target.classList.add("gravando")
	hotkeys.setScope("gravando")
}
const iptAlterarAtalhoHandleOnFocusOut = e => {
	gravando = null
	e.target.classList.remove("gravando")
	hotkeys.setScope("config")

	definirTodosAtalhos()
}

window.addEventListener("load", definirTodosAtalhos)