import { Dirent } from 'fs'
import { read } from 'jimp'
import { join } from 'path'
import { createContext, useContext } from 'react'
import { pathToFileURL } from 'url'

export interface ICachedFile {
    readonly href: string
}

export interface IAppState {
    stepIndex: number
    fileCache: Record<string, ICachedFile>
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AppState = createContext<IAppState>(undefined as unknown as IAppState)

export function getCachedFile(file: Dirent): ICachedFile {
    const state = useContext(AppState)

    let existing = state.fileCache[file.name]

    if (!existing) {
        read(join(file.path, file.name), (err, img) => {
            console.log(err || img)
        })

        existing = { href: pathToFileURL(join(file.path, file.name)).href }

        state.fileCache[file.name] = existing
    }

    return existing
}
