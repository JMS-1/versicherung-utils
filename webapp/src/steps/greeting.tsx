import { clsx } from 'clsx'
import * as React from 'react'

import styles from './greeting.module.scss'

interface IGreetingProps {
    className?: string
}

const Greeting: React.FC<IGreetingProps> = (props) => {
    return (
        <div className={clsx(styles.step, props.className)}>
            <p>
                Dieses kleine Werkzeug soll Dir helfen, Unterlagen zum Beispiel für die private Krankenversicherung oder
                Zusatzversicherung in einer für die jeweilige Handy-App geeignten Form als PDF zur Verfügung zu stellen.
                Insbesondere soll es Dich unterstützen, wenn Du einen Flachbrettscanner an Deinen PC angeschlossen hast
                - wie bei vielen Druckern bereits integriert. Damit ist es dann nicht mehr notwendig, die Dokumente mit
                dem Handy zu fotographieren und dabei eventuell zu verwackeln.
            </p>
            <p>
                Nach dem Einscannen aller benötigten Dokumente können diese in PDF Dateien umgewandelt werden. Ist Dein
                Handy über USB an den PC angeschlossen können diese dann auch direkt auf dem Handy abgelegt werden.
            </p>
            <p>
                Dieses Werkzeug unterstützt auch das Festlegen der Reihenfolge der Dokumente sowie das Zusammenfassen
                von Dokumenten zu mehrseitigen PDF Dateien. Es wird trotzdem empfohlen, die Dokumente bereits in der
                gewünschten Reihenfolge einzuscannen - also auch bei mehrseitigen Dokumenten die einzelnen Seiten
                zusammenhängend und fortlaufend zu scannen. Das ist wie gesagt nicht zwingend, vereinfacht aber dem
                Vorgang.
            </p>
        </div>
    )
}

export default Greeting
