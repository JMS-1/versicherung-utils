import { clsx } from 'clsx'
import * as React from 'react'

import styles from './group.module.scss'
import { Groupitem } from './groupitem'

import { AppState } from '../state'

interface IGroupProps {
    className?: string
}

const Group: React.FC<IGroupProps> = (props) => {
    const state = React.useContext(AppState)

    const [indent, setIndent] = React.useState<Record<number, boolean>>({})

    const toggleIndent = React.useCallback((index: number) => setIndent((s) => ({ ...s, [index]: !s[index] })), [])

    React.useEffect(
        () => () => {
            const groups: number[][] = []

            let group: number[] = []

            for (let i = 0; i < state.files.length; i++) {
                if (!indent[i]) {
                    if (group.length > 0) groups.push(group)

                    group = []
                }

                group.push(i)
            }

            if (group.length > 0) groups.push(group)

            state.groups = groups
        },
        [indent, state]
    )

    return (
        <div className={clsx(styles.step, props.className)}>
            <div>
                <p>
                    Üblicherweise wird für jedes Dokument im nächsten Schritt eine eigene PDF Datei erstellt. Wird mit
                    dem Pfeil eines Dokuments dieses eingerückt, so wird es als zusätzliche Seite zum letzten vorherigen
                    nicht eingerücktem Dokument angefügt - die Anzahl der PDF Dateien reduziert sich dann natürlich
                    entsprechend. Das Einrücken kann natürlich jederzeit wieder rückgängig gemacht werden. Das erste
                    Dokument ist immer die erste Seite der ersten PDF Datei und kann daher niemals eingerückt werden.
                </p>
            </div>
            <div className={styles.docs}>
                {state.files.map((f, i) => (
                    <Groupitem key={f.name} file={f} indent={indent[i]} index={i} toggle={toggleIndent} />
                ))}
            </div>
        </div>
    )
}

export default Group
