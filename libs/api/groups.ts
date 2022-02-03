import { DestinationSearchEntry } from './maps'

export type JourneyType = 'walk' | 'bus' | 'taxi'

export interface IJourneyParticipant {
    id: string
    screenName: string
    avatarUrl: string
}

export interface IJourneyGroup {
    id: string
    owner: IJourneyParticipant
    type: JourneyType

    destination: DestinationSearchEntry
    origin: DestinationSearchEntry
}
