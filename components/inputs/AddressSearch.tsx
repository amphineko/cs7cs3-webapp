import { Autocomplete, TextField } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useUserLocation } from '../../contexts/userLocation'
import { DestinationSearchEntry } from '../../libs/api/maps'
import { useGeocodingForwardQuery } from '../../libs/client/queries/geocoding/useForwardQuery'
import { useReverseQuery } from '../../libs/client/queries/geocoding/useReverseQuery'

interface AddressSearchOption {
    entry: DestinationSearchEntry
    key: string
    label: string
}

export const AddressSearch = ({
    defaultToUserLocation,
    onChange,
}: {
    defaultToUserLocation?: boolean
    onChange: (value: DestinationSearchEntry) => void
}) => {
    const [value, setValue] = useState<AddressSearchOption | null>(null)
    const [inputValue, setInputValue] = useState('')
    const [defaultValueApplied, setDefaultValueApplied] = useState(false)

    const userLocation = useUserLocation()
    const userCoords =
        userLocation.readystate === 'ready'
            ? { lat: userLocation.position.coords.latitude, lng: userLocation.position.coords.longitude }
            : undefined

    const { data, isLoading } = useGeocodingForwardQuery(
        inputValue,
        userCoords,
        `${value?.entry.displayName} (${value?.entry.address})` !== inputValue
    )
    const { data: currentAddress } = useReverseQuery(userCoords)

    const options = useMemo(() => {
        const candidates: DestinationSearchEntry[] = []
        if (defaultToUserLocation && currentAddress?.length > 0) {
            candidates.push(currentAddress[0])
        }
        if (data?.length > 0) {
            candidates.push(...data)
        }

        return candidates.map<AddressSearchOption>((entry, idx) => ({
            entry,
            key: idx.toString(),
            label: `${entry.displayName} (${entry.address})`,
        }))
    }, [currentAddress, data, defaultToUserLocation])

    useEffect(() => {
        if (
            defaultToUserLocation &&
            !defaultValueApplied &&
            options?.length > 0 &&
            currentAddress?.length > 0 &&
            options[0].entry === currentAddress[0]
        ) {
            setInputValue(options[0].label)
            setValue(options[0])
            onChange(options[0].entry)

            setDefaultValueApplied(true)
        }
    }, [currentAddress, defaultToUserLocation, defaultValueApplied, onChange, options])

    return (
        <Autocomplete<AddressSearchOption, boolean, boolean, boolean>
            freeSolo={false}
            inputValue={inputValue}
            loading={isLoading}
            onChange={(_, newValue?: AddressSearchOption) => {
                if (typeof newValue === 'string') {
                    setValue(undefined)
                    return
                }

                setValue(newValue)
                onChange(newValue?.entry)
            }}
            onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
            options={options}
            popupIcon={<></>}
            renderInput={(params) => {
                return <TextField {...params} label="address" placeholder="where to?" />
            }}
            value={value}
        />
    )
}
