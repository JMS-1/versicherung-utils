import { clsx } from 'clsx'
import * as React from 'react'

import styles from './button.module.scss'

interface IButtonProps {
    children?: React.ReactNode
    className?: string
    click?(): void
    disabled?: boolean
}

export const Button: React.FC<IButtonProps> = (props) => {
    return (
        <button className={clsx(styles.button, props.className)} disabled={props.disabled} onClick={props.click}>
            {props.children}
        </button>
    )
}
