import { clsx } from 'clsx'
import * as React from 'react'

import { Footer } from './components/footer'
import { Header } from './components/header'
import styles from './root.module.scss'
import { AppState, IAppState } from './state'

const LazyGreeting = React.lazy(() => import('./steps/greeting'))
const LazySource = React.lazy(() => import('./steps/source'))

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
                return <LazyGreeting />
            case 1:
                return <LazySource />
        }
    }, [stepIndex])

    return (
        <AppState.Provider value={appState}>
            <div className={clsx(styles.root, props.className)}>
                <Header />
                <div className={styles.step}>
                    <React.Suspense>{step}</React.Suspense>
                </div>
                <Footer numSteps={2} />
            </div>
        </AppState.Provider>
    )
}
