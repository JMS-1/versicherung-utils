import { clsx } from 'clsx'
import { createWriteStream, mkdir } from 'fs'
import { IBrowseFolderResponse, IBrowserFolderRequest } from 'ipc'
import { join } from 'path'
import * as PDF from 'pdfkit'
import * as React from 'react'
import { promisify } from 'util'

import styles from './pdf.module.scss'

import { electronHost } from '../electron'
import { SettingsContext } from '../settings'
import { AppState, getCachedFile } from '../state'

interface IPdfProps {
    className?: string
}

function pad(num: number, width = 2): string {
    return `${num}`.padStart(width, '0')
}

type TState = 'prepare' | 'active' | 'done'

const Pdf: React.FC<IPdfProps> = (props) => {
    const state = React.useContext(AppState)
    const settings = React.useContext(SettingsContext)

    const [busy, setBusy] = React.useState<TState>('prepare')
    const [target, setTarget] = React.useState('')

    const onCreatePdf = React.useCallback(async () => {
        setBusy('active')

        const now = new Date()

        const dir = join(
            settings.settingsPath,
            `${pad(now.getFullYear(), 4)}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
        )

        setTarget(dir)

        try {
            await promisify(mkdir)(dir)

            let index = 0

            for (const group of state.groups) {
                const doc = new PDF({ margin: 0, size: 'A4' })

                for (const i of group) {
                    if (i !== group[0]) doc.addPage()

                    const image = await getCachedFile(state, state.files[i])

                    if (image.image) doc.image(image.image, { fit: [doc.page.width, doc.page.height] })
                }

                doc.pipe(createWriteStream(join(dir, `pdf-${pad(++index)}.pdf`)))

                doc.end()
            }

            setBusy('done')
        } catch (error) {
            setBusy('prepare')

            alert(error.message)
        }
    }, [state, settings])

    function setPath(ev: React.ChangeEvent<HTMLInputElement>): void {
        settings.update('settingsPath', ev.target.value)
    }

    function browsePath(): void {
        electronHost.send<IBrowserFolderRequest>({
            buttonLabel: 'Verwenden',
            defaultPath: settings.settingsPath,
            title: 'Ordner für PDF Dateien auswählen',
            type: 'folder-request',
        })
    }

    const selectPath = React.useCallback(
        (res: IBrowseFolderResponse) => {
            if (!res.folder) {
                return
            }

            settings.update('settingsPath', res.folder)
        },
        [settings]
    )

    React.useEffect(() => {
        electronHost.addListener('folder-response', selectPath)

        return () => electronHost.removeListener('folder-response', selectPath)
    }, [selectPath])

    return (
        <div className={clsx(styles.step, props.className, busy === 'active' && styles.busy)}>
            <p>
                Bitte wähle nun ein Verzeichnis auf Deinem PC, in dem die PDF Dokumente angelegt werden sollen. Dieses
                Werkzeug merkt sich die Auswahl des Zielverzeichnisses, so dass Du diese im Allgmeinen nur einmalig
                auswählen musst.
            </p>
            <label className={styles.directory}>
                <span>PDF Verzeichnis:</span>
                <input type='text' value={settings.settingsPath} onChange={setPath} />
                <button onClick={browsePath}>...</button>
            </label>
            <p>
                Die PDF Dateien werden erst bei Drücken auf die Schaltfläche erzeugt. Dazu wird im Zielverzeichnis ein
                Verzeichnis mit der aktuellen Uhrzeit als Namen angelegt, so dass ältere Dateien nicht überschrieben
                werden.
            </p>
            <button disabled={busy === 'active'} onClick={onCreatePdf}>
                PDF Dokumente erstellen
            </button>
            {busy === 'done' && (
                <p>
                    Du findest die erzeugten PDF Dokumente im Verzeichnis <i>{target}</i>. Du solltest nun Dein
                    Smartphone an diesen PC anschließen und die Dateien kopieren. Es empfiehlt sich, die Dokumente auf
                    dem PC zu behalten - etwa für spätere Rückfragen.
                </p>
            )}
        </div>
    )
}

export default Pdf
