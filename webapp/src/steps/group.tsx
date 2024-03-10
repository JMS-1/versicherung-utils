import { clsx } from 'clsx'
import * as React from 'react'

import styles from './group.module.scss'

import { AppState } from '../state'

interface IGroupProps {
    className?: string
}

const Group: React.FC<IGroupProps> = (props) => {
    const state = React.useContext(AppState)

    return (
        <div className={clsx(styles.step, props.className)}>
            {state.files.map((f) => (
                <div key={f.name}>{f.name}</div>
            ))}
        </div>
    )
}

export default Group
