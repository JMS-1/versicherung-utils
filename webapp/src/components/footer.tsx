import { clsx } from 'clsx'
import * as React from 'react'

import { Button } from './button'
import styles from './footer.module.scss'

import { AppState } from '../state'

interface IFooterProps {
    className?: string
    numSteps: number
}

export const Footer: React.FC<IFooterProps> = (props) => {
    const appState = React.useContext(AppState)

    const backward = React.useCallback(() => appState.stepIndex--, [appState])
    const forward = React.useCallback(() => appState.stepIndex++, [appState])

    return (
        <div className={clsx(styles.footer, props.className)}>
            <Button click={backward} disabled={appState.stepIndex <= 0}>
                &lt; Zurück
            </Button>
            <Button click={forward} disabled={appState.stepIndex >= props.numSteps - 1}>
                Weiter &gt;
            </Button>
        </div>
    )
}
