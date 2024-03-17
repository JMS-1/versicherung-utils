import { clsx } from 'clsx'
import * as React from 'react'

import styles from './pdf.module.scss'

import { AppState } from '../state'

interface IPdfProps {
    className?: string
}

const Pdf: React.FC<IPdfProps> = (props) => {
    const state = React.useContext(AppState)

    return <div className={clsx(styles.step, props.className)}>{JSON.stringify(state.groups)}</div>
}

export default Pdf
