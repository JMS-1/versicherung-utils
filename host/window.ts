import { config } from 'dotenv'
import { app, BrowserWindow, USBDevice } from 'electron'
import { BrowserWindowConstructorOptions } from 'electron/main'
import { dirname, join } from 'path'

/** Konfiguration aus einer .env Datei einlesen. */
const appImage = app.isPackaged && (process.env.APPIMAGE || process.env.PORTABLE_EXECUTABLE_FILE)

config(appImage ? { path: join(dirname(appImage), '.env') } : undefined)

/** Man beachte, dass diese Environmentvariable vor dem Aufruf des Electron Hosts explizit gesetzt werden muss. */
export const isProduction = process.env.NODE_ENV === 'production' || app.isPackaged

export function createWindow(): BrowserWindow {
    const browserOptions: BrowserWindowConstructorOptions = {
        autoHideMenuBar: true,
        height: 800,
        title: 'Mein kleiner Dokumentenhelfer',
        useContentSize: true,
        webPreferences: {
            backgroundThrottling: false,
            contextIsolation: false,
            devTools: !isProduction,
            nodeIntegration: true,
            webSecurity: false,
        },
        width: 1600,
    }

    const window = new BrowserWindow(browserOptions)

    let grantedDeviceThroughPermHandler: USBDevice | undefined

    window.webContents.session.on('select-usb-device', (event, details, callback) => {
        // Add events to handle devices being added or removed before the callback on
        // `select-usb-device` is called.
        window.webContents.session.on('usb-device-added', (event, device) => {
            console.log('usb-device-added FIRED WITH', device)
            // Optionally update details.deviceList
        })

        window.webContents.session.on('usb-device-removed', (event, device) => {
            console.log('usb-device-removed FIRED WITH', device)
            // Optionally update details.deviceList
        })

        event.preventDefault()

        if (details.deviceList && details.deviceList.length > 0) {
            const deviceToReturn = details.deviceList.find((device) => {
                return !grantedDeviceThroughPermHandler || device.deviceId !== grantedDeviceThroughPermHandler.deviceId
            })

            if (deviceToReturn) {
                callback(deviceToReturn.deviceId)
            } else {
                callback()
            }
        }
    })

    window.webContents.session.setDevicePermissionHandler((details) => details.deviceType === 'usb')

    if (isProduction) window.setMenu(null)

    return window
}
