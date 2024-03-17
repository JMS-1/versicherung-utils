/* eslint-disable @typescript-eslint/naming-convention */

import { clsx } from 'clsx'
import { Dirent } from 'fs'
import * as React from 'react'

import styles from './groupitem.module.scss'

import Right from '../images/right.svg'
import Root from '../images/root.svg'
import { AppState, getCachedFile, ICachedFile } from '../state'

interface IGroupitemProps {
    className?: string
    file: Dirent
    indent: boolean
    index: number
    toggle(index: number): void
}

export const Groupitem: React.FC<IGroupitemProps> = (props) => {
    const state = React.useContext(AppState)

    const [cached, setCached] = React.useState<ICachedFile | undefined>(undefined)

    const { file, index, toggle } = props

    React.useEffect(() => {
        if (file) getCachedFile(state, file).then(setCached)
    }, [file, state])

    const onToggle = React.useCallback(() => {
        if (index) toggle(index)
    }, [index, toggle])

    return (
        <div className={clsx(styles.item, props.className)}>
            <div
                className={clsx(styles.action, props.indent && styles.indent)}
                dangerouslySetInnerHTML={{ __html: index ? Right : Root }}
                onClick={onToggle}
            />
            <img className={styles.image} src={cached?.href} />
            {file.name}
        </div>
    )
}
