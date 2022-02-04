import { useQuery } from 'react-query'
import { validate as validateUuid } from 'uuid'
import { IJourneyGroup } from '../../api/groups'

export const fetchDetail = async (id: string, base: string) => {
    const url = new URL('/api/v1/groups/details', base)
    url.searchParams.set('id', id)

    const req = await fetch(url.toString())
    if (req.ok) {
        const resp = (await req.json()) as unknown as {
            code: number
            data?: IJourneyGroup
            error: string
        }

        if (resp.code !== 200 && resp.data !== undefined) {
            throw new Error(`Request returned an error: ${resp.error} (${resp.code})`)
        }

        return resp.data
    } else {
        throw new Error(`fetch() returned an error: ${req.statusText} (${req.status})`)
    }
}

export const useGroupQuery = (id?: string, initialData?: IJourneyGroup) => {
    return useQuery(
        ['group-detail', id],
        async () => {
            if (id === undefined) {
                return
            }

            return await fetchDetail(id, window.location.href)
        },
        {
            enabled: validateUuid(id),
            initialData,
            useErrorBoundary: true,
        }
    )
}
