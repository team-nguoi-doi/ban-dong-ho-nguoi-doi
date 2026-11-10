
import {useEffect, useState} from "react";
import type {AddressOption} from "./utils/types.ts";
import {addressApi} from "./api/addressApi.ts";

const EMPTY: AddressOption[] = [];

interface AddressState {
    key: string | null;
    options: AddressOption[];
    error: boolean;
}

function useOptions(key: string | null, loadProvinces: (key: string) => Promise<AddressOption[]>) {
    const [state, setState] = useState<AddressState>({key: null, options: EMPTY, error: false});
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        if(key === null) return;
        let ignore = false;

        loadProvinces(key)
            .then((options => {
                if(!ignore) setState({key, options, error: false});
            }))
            .catch(() => {
                if(!ignore) setState({key, options: EMPTY, error: true});
            });

        return () => {
            ignore = true;
        }
    }, [key, loadProvinces, attempt]);

    const ready = key !== null && state.key === key;
    return {
        options: ready ? state.options : EMPTY,
        loading: key !== null && !ready,
        error: ready && state.error,
        retry: () => setAttempt((n) => n+1)
    }
}

let loadProvinces = () => addressApi.getProvinces();
let loadWards = (provinceCode: string) => addressApi.getWards(provinceCode);

export const useProvinces = () => useOptions('all', loadProvinces);
export const useWards = (provinceCode: string | null) => useOptions(provinceCode, loadWards);