import { clsx } from 'clsx'
import { Dirent, readdir, stat, Stats } from 'fs'
import { extname, join } from 'path'
import * as React from 'react'

import { File } from './file'
import styles from './files.module.scss'
import { Preview } from './preview'

import { useSettings } from '../settings'

interface IFilesProps {
    className?: string
}

const supportedFileTypes = new Set(['.jpg', '.jpeg', '.png'])

const Files: React.FC<IFilesProps> = (props) => {
    const settings = useSettings()

    const [files, setFiles] = React.useState<[Dirent, Stats, boolean][]>([])
    const [preview, setPreview] = React.useState<Dirent | undefined>(undefined)

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
        (index: number, selected: boolean) =>
            setFiles((files) => {
                files = [...files]

                files[index][2] = selected

                return files
            }),
        []
    )

    return (
        <div className={clsx(styles.step, props.className)}>
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
