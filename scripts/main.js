var SS_Options = SS_Options || {};
(function() { // SS_Options namespace
	var THIS = this
	var count_text = "Começaremos em breve!"
	function init() {
		document.querySelectorAll("form").forEach(element => {
			element.addEventListener("submit", e => e.preventDefault())
		})
		
		document.querySelector("#fm_info").addEventListener("change", Handles.fmInfoHandle)
		document.querySelector("#fm_time").addEventListener("submit", Handles.fmTimeHandle)
		document.querySelector("#fm_add_time").addEventListener("submit", Handles.fmAddTimeHandle)
		document.querySelector("#fm_theme").addEventListener("change", Handles.fmThemeHandle)
	
		document.querySelector("#s_count").innerText = count_text
		document.querySelector("#s_count").setAttribute("data-text", count_text)
	
		document.querySelector("#btn_exit_config").addEventListener("click", THIS.HotKeys.Handles.atalhoFecharConfigHandle)
		document.querySelector("#btn_open_config").addEventListener("click", THIS.HotKeys.Handles.atalhoAbrirConfigHandle)
		THIS.HotKeys.Handles.atalhoAbrirConfigHandle()
	
		document.querySelectorAll("#fm_atal input").forEach(element => {
			element.addEventListener("focusin", THIS.HotKeys.Handles.iptAlterarAtalhoHandleOnFocusIn)
			element.addEventListener("focusout", THIS.HotKeys.Handles.iptAlterarAtalhoHandleOnFocusOut)
		})
		THIS.HotKeys.init()
		THIS.Music.init()
	}

	var Handles = {};
	(function() { // Handles namespace
		var SocialMediaHandles = {};
		(function() { // SocialMediaHandles namespace
			this.socialMediaHandle = (e, keys) => {
				const parent = e.target.parentElement
				const index = Array(...parent.parentElement.children).indexOf(parent)
				const emptySibling = (e.target.previousElementSibling && e.target.previousElementSibling.value == "") || (e.target.nextElementSibling && e.target.nextElementSibling.value == "")
				const li_query = `#${keys[e.target.className]} .index-${index}`
				if (e.target.value == "") {
					if (emptySibling) parent.parentElement.removeChild(parent)
			
					const li = document.querySelector(li_query)
					if (li) {
						li.parentElement.removeChild(li)
					}
				}
				else {
					if (e.target.value != "" && parent.nextElementSibling == null) {
						const row = parent.cloneNode(true)
						row.firstElementChild.value = ""
						row.lastElementChild.value = ""
						parent.insertAdjacentElement('afterEnd', row)
					}
					let li = document.querySelector(li_query)
					if (li === null) {
						li = document.createElement("li")
						li.classList.add(`index-${index}`)
						document.querySelector(`#${keys[e.target.className]}`).appendChild(li)
					}
					li.innerText = getShortUrl(e.target.value)
					li.classList.add(getWebSiteName(e.target.value))
				}
			}
			function getShortUrl(url) {
				const pattern = /(\w+\.(?:com|net|tv|com\.br|me).*)/ig
				const result = pattern.exec(url)
				return result[1]
			}
			function getWebSiteName(url) {
				const pattern = /(\w+).(?:com|net|tv|com\.br|me)/ig
				const result = pattern.exec(url)
				return result[1]
			}			
		}).apply(SocialMediaHandles)
		this.fmInfoHandle = function(e) {
			e.preventDefault()
			
			const keys = {
				'ipt_org': 'h_org',
				'ipt_title': 'h_title',
				'ipt_social_media': 'ul_social_medias',
				'ipt_social_media_secundary': 'ul_social_medias_secundary',
				'ipt_link_hotpage': 'a_hotpage'
			}
		
			switch (e.target.className) {
				case 'ipt_social_media':
				case 'ipt_social_media_secundary':
					SocialMediaHandles.socialMediaHandle(e, keys);
					break
		
				default:
					document.querySelector(`#${keys[e.target.id]}`).innerHTML = e.target.value
					document.querySelector(`#${keys[e.target.id]}`).setAttribute("data-text", e.target.value)
			}

		}

		var CountDown = {};
		(function() { // CountDown namespace
			this.countInterval = null
			this.endTimeMessage = null

			this.stopCountDown = () => {
				clearInterval(this.countInterval)
				this.countInterval = null
				document.querySelector("#btn_start_stop_time").value = "Começar"
				document.querySelector("#ipt_time_2_end").disabled = false;
				this.endTimeMessage = setTimeout(() => {
					document.querySelector("#s_count").innerText = count_text
					document.querySelector("#s_count").setAttribute("data-text", count_text)
				}, 5000)
			}
			this.countDown = end => {
				const now = new Date(),
				left = {
					hours: Math.floor(Math.abs(end - now) / 36e5).toFixed(0).padStart(2, 0),
					minutes: (Math.floor(Math.abs(end - now) / 6e4) % 60).toFixed(0).padStart(2, 0),
					seconds: (Math.floor(Math.abs(end - now) / 1e3) % 60).toFixed(0).padStart(2, 0)
				}
				
				const text = `<b>${left.hours}</b>:${left.minutes}:<i>${left.seconds}</i>`
				document.querySelector("#s_count").innerHTML = text
				document.querySelector("#s_count").setAttribute("data-text", text.replace(/<\/?[^>]+(>|$)/g, ""))
				
				if (end <= now) this.stopCountDown()
			}
		}).apply(CountDown)
		this.fmTimeHandle = e => {
			e.preventDefault()
			
			if (!CountDown.countInterval) {
				const now = new Date(),
					ipt_data = e.target.ipt_time_2_end.value.split(":"),
					ipt_hour = Number(ipt_data[0]),
					ipt_minute = Number(ipt_data[1]),
					estimed_end = new Date(new Date().setHours(ipt_hour, ipt_minute, 0))
				
				if (now > estimed_end) {
					estimed_end.setDate(now.getDate()+1)
				}
				
				clearTimeout(CountDown.endTimeMessage)
				CountDown.countInterval = setInterval(CountDown.countDown, 10, estimed_end)
				
				e.target.ipt_time_2_end.disabled = true;
				document.querySelector("#btn_start_stop_time").value = "Parar"
			} else {
				CountDown.stopCountDown()
			}
		}
		this.fmAddTimeHandle = () => {
			clearTimeout(CountDown.endTimeMessage) // Precisa parar o timeout aqui pois quando chamar o stopCountDown, ele criará um novo timeout e o anterior continuará sendo executado mesmo que o novo seja parado dentro do fmTimeHandle
			CountDown.stopCountDown()
			
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

		this.fmThemeHandle = e => {
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
		
				script.setAttribute("src", `themes/${theme_name}/${theme_name}.js`)
			} else {
				if (style !== null) style.parentElement.removeChild(style)
				if (script !== null) script.parentElement.removeChild(script)
			}
		}
	}).apply(Handles)

	this.onDocumentLoadHandle = function () {
		init()	
	}
}).apply(SS_Options)

window.addEventListener("load", SS_Options.onDocumentLoadHandle)

function onYouTubeIframeAPIReady() {
	SS_Options.Music.Handlers.ytAPIReadyHandle()
}