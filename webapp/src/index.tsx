import './index.scss'

import * as React from 'react'
import { createRoot } from 'react-dom/client'

import { Root } from './root'

navigator.usb
    .getDevices()
    .then((devices) => devices.find((device) => device.manufacturerName === 'OPPO'))
    .then((device) => {
        if (!device) return

        return device.open().then(() => device)
    })
    .then((device) => {
        if (!device) return

        alert(device)
    })

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.querySelector('body > client-root')!).render(<Root />)

document.onkeyup = (ev): void => {
    if (!ev.ctrlKey) {
        return
    }

    const delta = ev.key === '+' ? +1 : ev.key === '-' ? -1 : 0

    if (!delta) {
        return
    }

    const html = document.documentElement
    const old = html.style.fontSize || '14px'
    const size = Math.max(14, parseInt(old) + delta)

    html.style.fontSize = `${size}px`
}
