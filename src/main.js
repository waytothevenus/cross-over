/*
	BUGS:
	- App theme color breaks after reset
	- Keybind settings don't display on first load

	Todo:
		-

	Todo: when updating electron to 12+:
		- Test iohook
		- Test closing the devtools windows, opacity should not go to 100%

	Changed:
		#20 Custom keybinds
		#85 turn off updates
		#84 Mouse hooks
		#70 Performance settings - gpu
		#86 start on boot
		#88 allow disable keybinds
		hide settings on blur
		Custom crosshair should be a setting

	High:
		test window placement on windows/mac
		fix unhandled #81

	Medium:
		polish menu
		shadow window bug on move to next display

	Low:
		Conflicting accelerator on Fedora
		dont set.position if monitor has been unplugged

*/

// const NativeExtension = require('bindings')('NativeExtension');

console.time( 'init' )

const process = require( 'process' )

const { app } = require( 'electron' )
const { is } = require( 'electron-util' )
const debug = require( 'electron-debug' )
const { checkboxTrue } = require( './config/utils.js' )

const errorHandling = require( './main/error-handling.js' )
const log = require( './main/log.js' )
const preferences = require( './main/preferences.js' ).init()
const windows = require( './main/windows.js' )
const sound = require( './main/sound.js' )
const autoUpdate = require( './main/auto-update.js' )
const menu = require( './main/menu.js' )
const register = require( './main/register.js' )
const init = require( './main/init.js' )
const reset = require( './main/reset.js' )

/* App setup */
console.log( '***************' )
log.info( `CrossOver ${app.getVersion()} ${is.development ? '* Development *' : ''}` )

// Handle errors early
errorHandling.init()

// Prevent multiple instances of the app
if ( !app.requestSingleInstanceLock() ) {

	app.quit()

}

// Note: Must match `build.appId` in package.json
app.setAppUserModelId( 'com.lacymorrow.crossover' )

// Debug Settings
debug( {
	showDevTools: is.development && !is.linux,
	devToolsMode: 'undocked',
} )

// Electron reloader is janky sometimes
// try {
//  require( 'electron-reloader' )( module )
// } catch {}

//
// Const contextMenu = require('electron-context-menu')
// contextMenu()

// Fix for Linux transparency issues
if ( is.linux || !checkboxTrue( preferences.value( 'app.gpu' ), 'gpu' ) ) {

	// Disable hardware acceleration
	log.info( 'Setting: Disable GPU' )
	app.commandLine.appendSwitch( 'enable-transparent-visuals' )
	app.commandLine.appendSwitch( 'disable-gpu' )
	app.disableHardwareAcceleration()

} else {

	log.info( 'Setting: Enable GPU' )

}

const ready = async () => {

	log.info( 'App ready' )

	/* MENU */
	menu.init()

	await windows.init()

	// Values include normal, floating, torn-off-menu, modal-panel, main-menu, status, pop-up-menu, screen-saver
	windows.win.setAlwaysOnTop( true, 'screen-saver' )
	// Log.info( windows.win.getNativeWindowHandle() )

	sound.preload()

	/* AUTO-UPDATE */
	autoUpdate.update()

	// Allow command-line reset
	if ( process.env.CROSSOVER_RESET ) {

		log.info( 'Command-line reset triggered' )
		reset.app( true )

	}

	/* Press Play >>> */
	init()

	console.timeEnd( 'init' )

}

module.exports = async () => {

	register.appEvents()

	await app.whenReady()

	// Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
	setTimeout( ready, 400 )

}
