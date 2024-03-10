import { clsx } from 'clsx'
import { Dirent } from 'fs'
import * as React from 'react'

import styles from './sortitem.module.scss'

import { AppState, getCachedFile, ICachedFile } from '../state'

interface ISortItemProps {
    className?: string
    file: Dirent
}

export const SortItem: React.FC<ISortItemProps> = (props) => {
    const state = React.useContext(AppState)

    const [cached, setCached] = React.useState<ICachedFile | undefined>(undefined)

    const { file } = props

    React.useEffect(() => {
        if (file) getCachedFile(state, file).then(setCached)
    }, [file, state])

    return <img className={clsx(styles.item, props.className, cached?.href && styles.show)} src={cached?.href} />
}
