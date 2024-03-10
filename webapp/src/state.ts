import { Dirent } from 'fs'
import { read } from 'jimp'
import { join } from 'path'
import { createContext } from 'react'

export interface ICachedFile {
    href: string
    image?: Buffer
    readonly file: Dirent
}

export interface ICachedFileInternal extends ICachedFile {
    readonly promise: Promise<ICachedFile>
}

export interface IAppState {
    stepIndex: number
    fileCache: Record<string, ICachedFileInternal>
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AppState = createContext<IAppState>(undefined as unknown as IAppState)

export function getCachedFile(state: IAppState, file: Dirent): Promise<ICachedFile> {
    /* See if file is already requested. */
    let existing = state.fileCache[file.name]

    if (!existing) {
        /* Create a new request and start it. */
        let whenDone: (cached: ICachedFile) => void

        existing = { file, href: '', promise: new Promise<ICachedFile>((success) => (whenDone = success)) }

        state.fileCache[file.name] = existing

        read(join(file.path, file.name), async (err, img) => {
            try {
                /* Failed somehow. */
                if (err || !img) return

                /* Rescale. */
                const width = img.getWidth()
                const height = img.getHeight()

                if (width <= 0 || height <= 0) return

                img.scale(1000.0 / Math.max(width, height))

                /* Get the buffer from the content. */
                existing.image = await img.getBufferAsync('image/png')

                /* Remember final image. */
                existing.href = `data:image/png;base64,${existing.image.toString('base64')}`
            } finally {
                /* Mark as finished. */
                whenDone(existing)
            }
        })
    }

    return existing.promise
}
