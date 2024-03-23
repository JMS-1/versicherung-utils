import { clsx } from 'clsx'
import * as React from 'react'

import styles from './header.module.scss'

import { AppState } from '../state'

interface IHeaderProps {
    className?: string
}

const headers = [
    'Willkommen',
    'Verzeichnis mit Dokumenten',
    'Dokumente auswählen',
    'Reihenfolge festlegen',
    'Seiten gruppieren',
    'PDF erzeugen',
]

export const Header: React.FC<IHeaderProps> = (props) => {
    const { stepIndex } = React.useContext(AppState)

    return <div className={clsx(styles.header, props.className)}>{headers[stepIndex] || '\xa0'}</div>
}
