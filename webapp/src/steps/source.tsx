import { clsx } from 'clsx'
import * as React from 'react'

import styles from './source.module.scss'

interface ISourceProps {
    className?: string
}

export const Source: React.FC<ISourceProps> = (props) => {
    return <div className={clsx(styles.step, props.className)}>[source]</div>
}
