import { clsx } from 'clsx'
import { Dirent } from 'fs'
import * as React from 'react'

import { Footer } from './components/footer'
import { Header } from './components/header'
import styles from './root.module.scss'
import { SettingsContext, useSettings } from './settings'
import { AppState, IAppState, ICachedFileInternal } from './state'

const LazyFiles = React.lazy(() => import('./steps/files'))
const LazyGreeting = React.lazy(() => import('./steps/greeting'))
const LazyGroup = React.lazy(() => import('./steps/group'))
const LazySort = React.lazy(() => import('./steps/sort'))
const LazySource = React.lazy(() => import('./steps/source'))

interface IRootProps {
    className?: string
}

export const Root: React.FC<IRootProps> = (props) => {
    const [stepIndex, setStepIndex] = React.useState(0)
    const [files, setFiles] = React.useState<Dirent[]>([])

    const fileCache = React.useMemo<Record<string, ICachedFileInternal>>(() => ({}), [])

    const settings = useSettings()

    const appState = React.useMemo<IAppState>(
        () => ({
            fileCache,
            get files() {
                return files
            },
            set files(files: Dirent[]) {
                setFiles(files)
            },
            get stepIndex() {
                return stepIndex
            },
            set stepIndex(stepIndex: number) {
                setStepIndex(stepIndex)
            },
        }),
        [fileCache, files, stepIndex]
    )

    const step = React.useMemo(() => {
        switch (stepIndex) {
            case 0:
                return <LazyGreeting />
            case 1:
                return <LazySource />
            case 2:
                return <LazyFiles />
            case 3:
                return <LazySort />
            case 4:
                return <LazyGroup />
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
                    <Footer numSteps={5} />
                </div>
            </SettingsContext.Provider>
        </AppState.Provider>
    )
}
