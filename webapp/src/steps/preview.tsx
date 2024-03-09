import { clsx } from 'clsx'
import { Dirent } from 'fs'
import { join } from 'path'
import * as React from 'react'
import { pathToFileURL } from 'url'

import styles from './preview.module.scss'

interface IPreviewProps {
    className?: string
    file: Dirent | undefined
}

export const Preview: React.FC<IPreviewProps> = (props) => {
    const { file } = props

    const fileRef = React.useMemo(() => {
        return file && pathToFileURL(join(file.path, file.name)).href
    }, [file])

    return file ? <img className={clsx(styles.preview, props.className)} src={fileRef} /> : <div />
}
