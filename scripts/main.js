import SS_Options from './ss_options.js'

window.addEventListener("load", SS_Options.Handlers.onDocumentLoadHandler)

function onYouTubeIframeAPIReady() {
	SS_Options.Music.Handlers.ytAPIReadyHandler()
}