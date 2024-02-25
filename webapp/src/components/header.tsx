import { clsx } from 'clsx'
import * as React from 'react'

import styles from './header.module.scss'

interface IHeaderProps {
    className?: string
}

export const Header: React.FC<IHeaderProps> = (props) => {
    return <div className={clsx(styles.header, props.className)}>[header]</div>
}
