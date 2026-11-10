
import axios from "axios";

import {ADDRESS_API_URL} from "../utils/constants.ts";
import type {AddressOption} from "../utils/types.ts";

const http = axios.create({baseURL: ADDRESS_API_URL})

let provincesCache : AddressOption[] | null = null;
let wardsCache = new Map<string, AddressOption[]>()

interface RawUnit {
    code: number | string,
    name: string,
}

const toOption = (unit: RawUnit): AddressOption => ({
    code: String(unit.code),
    label: String(unit.name),
})

const byName = (a: AddressOption, b: AddressOption) => a.label.localeCompare(b.label);

export const addressApi = {

    async getProvinces(): Promise<AddressOption[]> {
        if(provincesCache) return provincesCache;
        const { data } = await http.get<RawUnit[]>('/p')
        provincesCache = data.map(toOption).sort(byName)
        return provincesCache
    },

    async getWards(provinceCode: string): Promise<AddressOption[]> {
        const cached = wardsCache.get(provinceCode);

        if(cached) return cached;

        const { data } = await http.get<{ wards: RawUnit[] }>(`/p/${provinceCode}`, {
            params: { depth: 2 },
        });

        const wards = data.wards.map(toOption).sort(byName);
        wardsCache.set(provinceCode, wards);
        return wards;
    }
}