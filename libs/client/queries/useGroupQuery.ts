import { useQuery } from 'react-query'
import { validate as validateUuid } from 'uuid'
import { IJourneyGroup } from '../../api/groups'

export const useGroupQuery = (id?: string, initialData?: IJourneyGroup) => {
    return useQuery(
        ['group-detail', id],
        async () => {
            const url = new URL('/api/v1/groups/details', window.location.href)
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
        },
        {
            enabled: validateUuid(id),
            initialData,
            useErrorBoundary: true,
        }
    )
}
