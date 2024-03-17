import { IConfigRequest, IConfigResponse } from 'ipc'
import * as React from 'react'

import { electronHost } from './electron'

interface IConfigurationData {
    rootPath: string
    settingsPath: string
}

export interface IConfiguration extends IConfigurationData {
    update<TKey extends keyof IConfigurationData>(key: TKey, value: IConfigurationData[TKey]): void
}

const initialConfig: IConfiguration = {
    rootPath: '',
    settingsPath: '',
    update: () => alert('out of bound call to settings updater'),
}

export function useSettings(): Readonly<IConfiguration> {
    const [settings, setSettings] = React.useState<IConfigurationData>(initialConfig)
    const [config, setConfig] = React.useState('')

    function loadConfig(res: IConfigResponse): void {
        setConfig(res.configName)

        setSettings({
            ...initialConfig,
            ...JSON.parse(localStorage.getItem(res.configName) || JSON.stringify(initialConfig)),
        })
    }

    React.useEffect(() => {
        electronHost.addListener('config-response', loadConfig)

        return () => electronHost.removeListener('config-response', loadConfig)
    }, [])

    React.useEffect(() => electronHost.send<IConfigRequest>({ type: 'config-request' }), [])

    const writeSettings = React.useCallback(
        (settings: IConfigurationData) => {
            setSettings(settings)

            if (config) {
                localStorage.setItem(config, JSON.stringify(settings))
            }
        },
        [config]
    )

    const update = React.useCallback(
        <TKey extends keyof IConfigurationData>(key: TKey, value: IConfigurationData[TKey]) =>
            writeSettings({ ...settings, [key]: value }),
        [settings, writeSettings]
    )

    return React.useMemo(() => ({ ...settings, update }), [settings, update])
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const SettingsContext = React.createContext<IConfiguration>(initialConfig)
