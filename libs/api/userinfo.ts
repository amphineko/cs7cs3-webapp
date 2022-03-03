import { IJourneyGroup } from './groups'

export type GenderType = 'Male' | 'Female'

export interface IUserInfo {
    id: string
    avatarUrl: string
    username: string
    gender: GenderType
    rating: number
    review: string[]
    journeys: IJourneyGroup[]
}

export interface IUserInfoMini {
    id: string
    avatarUrl: string
    username: string
    gender: GenderType
    rating: number
}
