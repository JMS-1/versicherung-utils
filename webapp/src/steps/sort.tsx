import { clsx } from 'clsx'
import * as React from 'react'

import styles from './sort.module.scss'
import { SortItem } from './sortitem'

import { AppState } from '../state'

interface ISortProps {
    className?: string
}

const Sort: React.FC<ISortProps> = (props) => {
    const state = React.useContext(AppState)

    const [files, setFiles] = React.useState(state.files)

    const onDrop = React.useCallback(
        (source: string, target: string) => {
            const sourceIndex = files.findIndex((f) => f.name === source)
            const targetIndex = files.findIndex((f) => f.name === target)

            if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return

            const newFiles = [...files]

            newFiles.splice(targetIndex + (sourceIndex < targetIndex ? 0 : 1), 0, newFiles.splice(sourceIndex, 1)[0])

            setFiles(newFiles)

            setTimeout(() => (state.files = newFiles), 0)
        },
        [files, state]
    )

    return (
        <div className={clsx(styles.step, props.className)}>
            <div>
                <p>
                    Alle im vorherigen Schritt ausgewählten Dokumente werden hier in der zeitlichen Reihenfolge des
                    Scans angezeigt - beginnend mit dem zuerst eingespielten (ältesten) Dokument. Du kannst die
                    Reihenfolge durch Ziehen mit der Maus verändern - wird ein Dokument mit der Maus über ein anderes
                    gezogen, so wird es hinter diesem eingefügt.
                </p>
            </div>
            <div className={styles.files}>
                {files.map((f) => (
                    <SortItem key={f.name} dropFile={onDrop} file={f} />
                ))}
            </div>
        </div>
    )
}

export default Sort
