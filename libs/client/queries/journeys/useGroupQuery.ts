import { useQuery } from 'react-query'
import { validate as validateUuid } from 'uuid'
import { useEndpoint } from '../../../../contexts/api'
import { IJourneyGroup } from '../../../api/groups'

export const getJourneyGroup = async (id: string, endpoint: string) => {
    const url = new URL(`api/v1/journeys/groups/${id}`, endpoint)
    const req = await fetch(url.toString())

    if (req.ok) {
        return (await req.json()) as IJourneyGroup
    } else {
        console.log(await req.text())
        throw new Error(`fetch() returned an error: ${req.statusText} (${req.status})`)
    }
}

export const useJourneyGroupQuery = (id?: string, initialData?: IJourneyGroup) => {
    const { liftEndpoint: endpoint } = useEndpoint()

    return useQuery(
        ['api/v1/journeys/groups', id],
        async () => {
            if (id === undefined) {
                return
            }

            return await getJourneyGroup(id, endpoint)
        },
        {
            enabled: validateUuid(id),
            initialData,
            useErrorBoundary: true,
        }
    )
}
