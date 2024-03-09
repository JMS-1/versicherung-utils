import { Dirent, Stats } from 'fs'
import moment from 'moment'
import * as React from 'react'

import styles from './file.module.scss'

interface IFileProps {
    file: [Dirent, Stats, boolean]
    index: number
    setSelect(index: number, selected: boolean): void
    showPreview(file: Dirent): void
}

export const File: React.FC<IFileProps> = (props) => {
    const { setSelect, index, showPreview } = props
    const [file, info, selected] = props.file

    const onChange = React.useCallback(
        (ev: React.ChangeEvent<HTMLInputElement>) => setSelect(index, ev.currentTarget.checked),
        [index, setSelect]
    )

    const onClick = React.useCallback(() => showPreview(file), [file, showPreview])

    return (
        <React.Fragment>
            <input checked={selected} type='checkbox' onChange={onChange}></input>
            <div className={styles.preview} onClick={onClick}>
                {file.name}
            </div>
            <div>{moment(info.mtime).format('DD.MM.yyyy HH:mm:ss')}</div>
        </React.Fragment>
    )
}
