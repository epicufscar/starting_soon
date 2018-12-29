import SS_Options from './ss_options.js'

window.addEventListener("load", SS_Options.Handlers.onDocumentLoadHandler)

window.onYouTubeIframeAPIReady = function () {
	SS_Options.Music.Handlers.ytAPIReadyHandler()
}