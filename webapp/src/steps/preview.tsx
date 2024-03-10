import { clsx } from 'clsx'
import { Dirent } from 'fs'
import * as React from 'react'

import styles from './preview.module.scss'

import { AppState, getCachedFile, ICachedFile } from '../state'

interface IPreviewProps {
    className?: string
    file: Dirent | undefined
}

export const Preview: React.FC<IPreviewProps> = (props) => {
    const state = React.useContext(AppState)

    const [cached, setCached] = React.useState<ICachedFile | undefined>(undefined)

    const { file } = props

    React.useEffect(() => {
        if (file) getCachedFile(state, file).then(setCached)
    }, [file, state])

    return file ? (
        <div className={clsx(styles.preview, props.className)}>
            <div>{file.name}</div>
            <img className={clsx(cached?.href && styles.show)} src={cached?.href} />
        </div>
    ) : (
        <div />
    )
}
