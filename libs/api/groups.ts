import { DestinationSearchEntry } from './maps'

export type JourneyType = 'walk' | 'bus' | 'taxi'

export interface IJourneyParticipant {
    id: string
    screenName: string
    avatarUrl: string
}

export interface IJourneyGroup {
    id: string
    type: JourneyType

    host: IJourneyParticipant
    guests: IJourneyParticipant[]

    destination: DestinationSearchEntry
    origin: DestinationSearchEntry
}
