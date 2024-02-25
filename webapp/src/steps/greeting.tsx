import { clsx } from 'clsx'
import * as React from 'react'

import styles from './greeting.module.scss'

interface IGreetingProps {
    className?: string
}

export const Greeting: React.FC<IGreetingProps> = (props) => {
    return <div className={clsx(styles.step, props.className)}>[greeting]</div>
}
