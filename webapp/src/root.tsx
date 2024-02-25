import { clsx } from 'clsx'
import * as React from 'react'

import { Footer } from './components/footer'
import { Header } from './components/header'
import styles from './root.module.scss'
import { AppState, IAppState } from './state'
import { Greeting } from './steps/greeting'
import { Source } from './steps/source'

interface IRootProps {
    className?: string
}

export const Root: React.FC<IRootProps> = (props) => {
    const [stepIndex, setStepIndex] = React.useState(0)

    const appState = React.useMemo<IAppState>(
        () => ({
            get stepIndex() {
                return stepIndex
            },
            set stepIndex(stepIndex: number) {
                setStepIndex(stepIndex)
            },
        }),
        [stepIndex]
    )

    const step = React.useMemo(() => {
        switch (stepIndex) {
            case 0:
                return <Greeting />
            case 1:
                return <Source />
        }
    }, [stepIndex])

    return (
        <AppState.Provider value={appState}>
            <div className={clsx(styles.root, props.className)}>
                <Header />
                <div className={styles.step}>{step}</div>
                <Footer numSteps={2} />
            </div>
        </AppState.Provider>
    )
}
