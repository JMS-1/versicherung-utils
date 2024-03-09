import { clsx } from 'clsx'
import { IBrowseFolderResponse, IBrowserFolderRequest } from 'ipc'
import * as React from 'react'

import styles from './source.module.scss'

import { electronHost } from '../electron'
import { SettingsContext } from '../settings'

interface ISourceProps {
    className?: string
}

const Source: React.FC<ISourceProps> = (props) => {
    const settings = React.useContext(SettingsContext)

    function setPath(ev: React.ChangeEvent<HTMLInputElement>): void {
        settings.update('rootPath', ev.target.value)
    }

    function browsePath(): void {
        electronHost.send<IBrowserFolderRequest>({
            buttonLabel: 'Verwenden',
            defaultPath: settings.rootPath,
            title: 'Ordner mit Scans auswählen',
            type: 'folder-request',
        })
    }

    const selectPath = React.useCallback(
        (res: IBrowseFolderResponse) => {
            if (!res.folder) {
                return
            }

            settings.update('rootPath', res.folder)
        },
        [settings]
    )

    React.useEffect(() => {
        electronHost.addListener('folder-response', selectPath)

        return () => electronHost.removeListener('folder-response', selectPath)
    }, [selectPath])

    return (
        <div className={clsx(styles.step, props.className)}>
            <label className={styles.directory}>
                <span>Scan Verzeichnis:</span>
                <input type='text' value={settings.rootPath} onChange={setPath} />
                <button onClick={browsePath}>...</button>
            </label>
        </div>
    )
}

export default Source
