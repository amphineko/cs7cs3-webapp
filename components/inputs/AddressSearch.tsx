import { Autocomplete, TextField } from '@mui/material'
import { useMemo, useState } from 'react'
import { useUserLocation } from '../../contexts/userLocation'
import { DestinationSearchEntry } from '../../libs/api/maps'
import { useAddressQuery } from '../../libs/client/queries/useAddressQuery'

interface AddressSearchOption {
    entry: DestinationSearchEntry
    key: string
    label: string
}

export const AddressSearch = ({ onChange }: { onChange: (value: DestinationSearchEntry) => void }) => {
    const [value, setValue] = useState<AddressSearchOption | ''>('')
    const [inputValue, setInputValue] = useState('')

    const { position } = useUserLocation()

    const { data, isLoading } = useAddressQuery(
        inputValue,
        position && { lat: position.coords.latitude, lng: position.coords.longitude },
        value !== inputValue
    )

    const options = useMemo(
        () =>
            data?.map<AddressSearchOption>((entry, idx) => ({
                entry,
                key: idx.toString(),
                label: `${entry.displayName} (${entry.fullName})`,
            })) ?? [],
        [data]
    )

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

                onChange(newValue?.entry)
                setValue(newValue)
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
