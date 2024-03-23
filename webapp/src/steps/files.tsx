import { clsx } from 'clsx'
import { Dirent, readdir, stat, Stats } from 'fs'
import { extname, join } from 'path'
import * as React from 'react'

import { File } from './file'
import styles from './files.module.scss'
import { Preview } from './preview'

import { useSettings } from '../settings'
import { AppState } from '../state'

interface IFilesProps {
    className?: string
}

const supportedFileTypes = new Set(['.jpg', '.jpeg', '.png'])

const Files: React.FC<IFilesProps> = (props) => {
    const state = React.useContext(AppState)

    const settings = useSettings()

    const [first, setFirst] = React.useState(true)
    const [files, setFiles] = React.useState<[Dirent, Stats, boolean][]>([])
    const [preview, setPreview] = React.useState<Dirent | undefined>(undefined)

    React.useEffect(() => {
        if (!first) return

        state.fileCache = {}
        state.files = []

        setFirst(false)
    }, [files, first, state])

    React.useEffect(() => {
        try {
            readdir(settings.rootPath, { withFileTypes: true }, (err, files) => {
                if (err) return

                const infos = files
                    .filter((f) => f.isFile() && supportedFileTypes.has(extname(f.name)))
                    .map((f) => [f, null as unknown as Stats, false] as [Dirent, Stats, boolean])

                let pending = infos.length

                infos.forEach((info) =>
                    stat(join(info[0].path, info[0].name), (e, s) => {
                        if (!e) info[1] = s

                        if (!--pending)
                            setFiles(
                                infos.slice().sort(([, l], [, r]) => {
                                    if (!l) return r ? -1 : 0
                                    if (!r) return +1

                                    return l.mtimeMs < r.mtimeMs ? +1 : l.mtimeMs > r.mtimeMs ? -1 : 0
                                })
                            )
                    })
                )
            })
        } catch (error) {
            setFiles([])
        }
    }, [settings])

    const onSelect = React.useCallback(
        (index: number, selected: boolean) => {
            const newFiles = [...files]

            newFiles[index][2] = selected

            setFiles(newFiles)

            setTimeout(() => (state.files = newFiles.filter((f) => f[2]).map((f) => f[0])).reverse(), 0)
        },
        [files, state]
    )

    return (
        <div className={clsx(styles.step, props.className)}>
            <div className={styles.explain}>
                <p>
                    Hier siehst Du alle Bilddateien, die sich in dem im vorherigen Schritt ausgewählen Scan Verzeichnis
                    befinden. Diese sind nach dem Zeitpunkt des Scans sortiert, der letzte Scan befindet sich dabei
                    immer am Anfang der Liste. In den meisten Fällen wird es ausreichen, die relevanten Dokumente
                    basierend auf dem Zeitpunkt auszuwählen - die Auswahl geschieht durch ein Anhaken der gewünschten
                    Dokumente. Im Folgenden werden dann nur die ausgewählten Dateien berücksichtigt.
                </p>
                <p>
                    Wenn Du unsicher bist um welche Dokumente es sich in der Liste handelt kannst Du auf den jeweiligen
                    Dateinamen klicken. Dann wird Dir rechts eine Vorschau angezeigt.
                </p>
            </div>
            <div className={styles.files}>
                {files.map((f, i) => (
                    <File key={f[0].name} file={f} index={i} setSelect={onSelect} showPreview={setPreview} />
                ))}
            </div>
            <Preview file={preview} />
        </div>
    )
}

export default Files
