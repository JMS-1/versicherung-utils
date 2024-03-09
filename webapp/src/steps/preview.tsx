import { clsx } from 'clsx'
import { Dirent } from 'fs'
import * as React from 'react'

import styles from './preview.module.scss'

import { getCachedFile } from '../state'

interface IPreviewProps {
    className?: string
    file: Dirent | undefined
}

export const Preview: React.FC<IPreviewProps> = (props) => {
    const { file } = props

    return file ? <img className={clsx(styles.preview, props.className)} src={getCachedFile(file).href} /> : <div />
}
