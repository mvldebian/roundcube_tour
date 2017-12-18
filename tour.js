/**
 * Roundcube Plugin Tour
 * Plugin for adding a tour to the site.
 *
 * @version 1.1
 * @author Alexander Pushkin <san4op@icloud.com>
 * @copyright Copyright (c) 2017, Alexander Pushkin
 * @link https://github.com/san4op/roundcube_tour
 * @license GNU General Public License, version 3
 */

if (window.rcmail) {
	rcmail.addEventListener('init', function(evt) {
		var intros = [];

		if (evt.task == "mail") {
			if (evt.action == "") {

				// welcome
				if (rcmail.env.tour.welcome == true)
					intros.push({
						intro: rcmail.gettext('welcome', 'tour')
					});

				// taskbar
				if (rcmail.env.tour.taskbar == true)
					intros.push({
						element: '#taskbar',
						intro: rcmail.gettext('taskbar', 'tour'),
						position: 'bottom-right-aligned'
					});

				// taskbar buttons
				if (rcmail.env.tour.taskbar_buttons)
					[
						"mail",
						"addressbook",
						"cloud",
						"calendar",
						"tasklist",
						"settings"
					].forEach(function(elm,inx,arr) {
						if (rcmail.env.tour.taskbar_buttons[elm] != undefined && rcmail.env.tour.taskbar_buttons[elm] == true)
							intros.push({
								element: '#taskbar .button-' + elm,
								intro: rcmail.gettext('taskbar_' + elm, 'tour'),
								position: 'bottom-right-aligned'
							});
					});

				// toolbar
				if (rcmail.env.tour.toolbar == true)
					intros.push({
						element: '#messagetoolbar',
						intro: rcmail.gettext('toolbar', 'tour'),
						position: 'bottom-right-aligned'
					});

				// toolbar buttons
				if (rcmail.env.tour.toolbar_buttons)
					[
						"archive",
						"junk"
					].forEach(function(elm,inx,arr) {
						if (rcmail.env.tour.toolbar_buttons[elm] != undefined && rcmail.env.tour.toolbar_buttons[elm] == true)
							switch(elm) {
								case "junk":
									intros.push({
										element: '#messagetoolbar .button.junk, #messagetoolbar .button.markasjunk2',
										intro: rcmail.gettext('toolbar_' + elm, 'tour'),
										position: 'bottom'
									});
									break;

								default:
									intros.push({
										element: '#messagetoolbar .button.' + elm,
										intro: rcmail.gettext('toolbar_' + elm, 'tour'),
										position: 'bottom'
									});
									break;
							}
					});

				// folders
				if (rcmail.env.tour.folders == true)
					intros.push({
						element: (rcmail.env.skin == "classic" ? "#mailboxlist-container ul" : "#folderlist-content ul"),
						intro: rcmail.gettext('folders', 'tour'),
						position: 'right'
					});

				// quota
				if (rcmail.env.tour.quota == true)
					intros.push({
						element: (rcmail.env.skin == "classic" ? "#quota" : "#quotadisplay"),
						intro: rcmail.gettext('quota', 'tour'),
						position: 'top'
					});

				// messageslist
				if (rcmail.env.tour.messages_view == true)
					intros.push({
						element: (rcmail.env.layout == 'widescreen' ? '#listmenulink' : '.messagelist.fixedcopy #rcmthreads #listmenulink'),
						intro: rcmail.gettext('messages_view', 'tour'),
						position: 'bottom'
					});
				if (rcmail.env.tour.messages_threads == true && rcmail.env.skin != "classic")
					intros.push({
						element: '#listcontrols',
						intro: rcmail.gettext('messages_threads', 'tour'),
						position: 'top'
					});

			} // end action ""
		} // end task "mail"

		else if (evt.task == "settings") {
			if (evt.action == "") {

				// settings
				if (rcmail.env.tour.settings)
					[
						"preferences",
						"folders",
						"identities",
						"responses",
						"pluginmanagesieve",
						"pluginmanagesievevacation",
						"pluginpassword"
					].forEach(function(elm,inx,arr) {
						if (rcmail.env.tour.settings[elm] != undefined && rcmail.env.tour.settings[elm] == true)
							intros.push({
								element: '#settingstab' + elm,
								intro: rcmail.gettext('settings_' + elm, 'tour'),
								position: 'right'
							});
					});

			} // end action ""
		} // end task "settings"

		if (intros.length > 0) {
			var intro = introJs();
			var intro_complete = 0;

			intro.setOptions({
				nextLabel: rcmail.gettext('next', 'tour'),
				prevLabel: rcmail.gettext('prev', 'tour'),
				skipLabel: rcmail.gettext('skip', 'tour'),
				doneLabel: rcmail.gettext('done', 'tour'),
				hidePrev: true,
				hideNext: true,
				showStepNumbers: false,
				showBullets: false,
				disableInteraction: true,
				exitOnOverlayClick: false,
				tooltipPosition: "bottom"
			});
			intro.addSteps(intros);

			intro.oncomplete(function() {
				intro_complete = 1;
				rcmail.http_post('plugin.tour_complete', {task: evt.task, action: evt.action, complete: 2});
			});
			intro.onexit(function() {
				if(intro_complete == undefined || intro_complete == 0) {
					rcmail.http_post('plugin.tour_complete', {task: evt.task, action: evt.action, complete: 1});
				}
			});

			intro.start();
		}
	});
}