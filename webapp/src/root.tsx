import { clsx } from 'clsx'
import * as React from 'react'

import { Footer } from './components/footer'
import { Header } from './components/header'
import styles from './root.module.scss'
import { SettingsContext, useSettings } from './settings'
import { AppState, IAppState } from './state'

const LazyFiles = React.lazy(() => import('./steps/files'))
const LazyGreeting = React.lazy(() => import('./steps/greeting'))
const LazySource = React.lazy(() => import('./steps/source'))

interface IRootProps {
    className?: string
}

export const Root: React.FC<IRootProps> = (props) => {
    const [stepIndex, setStepIndex] = React.useState(0)
    const settings = useSettings()

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
            case 2:
                return <LazyFiles />
        }
    }, [stepIndex])

    return (
        <AppState.Provider value={appState}>
            <SettingsContext.Provider value={settings}>
                <div className={clsx(styles.root, props.className)}>
                    <Header />
                    <div className={styles.step}>
                        <React.Suspense>{step}</React.Suspense>
                    </div>
                    <Footer numSteps={3} />
                </div>
            </SettingsContext.Provider>
        </AppState.Provider>
    )
}
