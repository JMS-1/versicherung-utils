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

    return (
        <div className={clsx(styles.step, props.className)}>
            {state.files.map((f) => (
                <SortItem key={f.name} file={f} />
            ))}
        </div>
    )
}

export default Sort
