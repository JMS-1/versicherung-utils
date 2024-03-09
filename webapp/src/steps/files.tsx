import { clsx } from 'clsx'
import { Dirent, readdir, stat, Stats } from 'fs'
import { join } from 'path'
import * as React from 'react'

import { File } from './file'
import styles from './greeting.module.scss'

import { useSettings } from '../settings'

interface IFilesProps {
    className?: string
}

const Files: React.FC<IFilesProps> = (props) => {
    const settings = useSettings()

    const [files, setFiles] = React.useState<[Dirent, Stats][]>([])

    React.useEffect(() => {
        try {
            readdir(settings.rootPath, { withFileTypes: true }, (err, files) => {
                if (err) return

                const infos = files
                    .filter((f) => f.isFile())
                    .map((f) => [f, null as unknown as Stats] as [Dirent, Stats])

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

    return (
        <div className={clsx(styles.step, props.className)}>
            {files.map((f) => (
                <File key={f[0].name} file={f} />
            ))}
        </div>
    )
}

export default Files
