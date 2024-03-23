/* eslint-disable @typescript-eslint/naming-convention */

import { clsx } from 'clsx'
import { Dirent } from 'fs'
import * as React from 'react'

import styles from './sortitem.module.scss'

import Right from '../images/right.svg'
import { AppState, getCachedFile, ICachedFile } from '../state'

interface ISortItemProps {
    className?: string
    dropFile(source: string, target: string): void
    file: Dirent
}

export const SortItem: React.FC<ISortItemProps> = (props) => {
    const state = React.useContext(AppState)

    const [cached, setCached] = React.useState<ICachedFile | undefined>(undefined)
    const [drop, setDrop] = React.useState(false)
    const [drag, setDrag] = React.useState(false)

    const { file, dropFile } = props

    React.useEffect(() => {
        if (file) getCachedFile(state, file).then(setCached)
    }, [file, state])

    const testDrop = React.useCallback(
        (ev: React.DragEvent<HTMLImageElement>) => (setDrop(true), (ev.dataTransfer.dropEffect = 'move')),
        []
    )

    const dragEnter = React.useCallback((ev: React.DragEvent<HTMLImageElement>) => testDrop(ev), [testDrop])

    const dragOver = React.useCallback(
        (ev: React.DragEvent<HTMLImageElement>) => (ev.preventDefault(), testDrop(ev)),
        [testDrop]
    )

    const dragLeave = React.useCallback(() => setDrop(false), [])

    const dragStart = React.useCallback(
        (ev: React.DragEvent<HTMLImageElement>) => {
            setDrag(true)

            ev.dataTransfer.effectAllowed = 'move'

            ev.dataTransfer.setData('sort-item', file.name)
        },
        [file]
    )

    const dragEnd = React.useCallback(() => setDrag(false), [])

    const onDrop = React.useCallback(
        (ev: React.DragEvent<HTMLImageElement>) => {
            ev.preventDefault()

            setDrop(false)

            const data = ev.dataTransfer.getData('sort-item')

            if (data) dropFile(data, file.name)
        },
        [file, dropFile]
    )

    return (
        <span className={clsx(styles.item, props.className)}>
            <img
                draggable
                className={clsx(cached?.href && styles.show, drop && styles.droptest, drag && styles.drag)}
                src={cached?.href}
                onDragEnd={dragEnd}
                onDragEnter={dragEnter}
                onDragLeave={dragLeave}
                onDragOver={dragOver}
                onDragStart={dragStart}
                onDrop={onDrop}
            />
            <div className={styles.arrow} dangerouslySetInnerHTML={{ __html: Right }} />
        </span>
    )
}
