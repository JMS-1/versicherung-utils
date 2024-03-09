import { clsx } from 'clsx'
import { Dirent, Stats } from 'fs'
import * as React from 'react'

import styles from './file.module.scss'

interface IFileProps {
    className?: string
    file: [Dirent, Stats]
}

export const File: React.FC<IFileProps> = (props) => {
    const [file, info] = props.file

    return (
        <div className={clsx(styles.file, props.className)}>
            {file.name} {info.size} {info.mtime.toISOString()}
        </div>
    )
}
