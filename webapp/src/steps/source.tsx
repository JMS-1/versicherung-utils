import { clsx } from 'clsx'
import * as React from 'react'

import styles from './source.module.scss'

interface ISourceProps {
    className?: string
}

const Source: React.FC<ISourceProps> = (props) => {
    return <div className={clsx(styles.step, props.className)}>[source]</div>
}

export default Source
