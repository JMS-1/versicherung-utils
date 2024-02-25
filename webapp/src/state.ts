import { createContext } from 'react'

export interface IAppState {
    stepIndex: number
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AppState = createContext<IAppState>(undefined as unknown as IAppState)
