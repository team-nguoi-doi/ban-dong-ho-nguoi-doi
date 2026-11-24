
import type {Address} from "../../account/utils/types.ts";
import type {AddressValue} from "./types.ts";

const blank = (): AddressValue => ({
    provinceCode: '', provinceName: '', wardCode: '', wardName: '', detail: ''
})

// Address (account) -> AddressValue (from checkout)
export function toAddressValue(a?: Address | null): AddressValue {
    if(!a) return blank();
    return {
        provinceCode: a.provinceCode ?? '',
        provinceName: a.provinceCode ? a.city : '',
        wardCode: a.wardCode ?? '',
        wardName: a.wardCode ? (a.region ?? '') : '',
        detail: a.streetAddress,
    };
}

// AddressValue (form checkout) -> Address (lưu vào account)
export function toAddress(v: AddressValue, fullName: string, phone: string): Address {
    return {
        fullName,
        phone,
        streetAddress: v.detail,
        city: v.provinceName,
        region: v.wardName,
        country: 'Việt Nam',
        provinceCode: v.provinceCode,
        wardCode: v.wardCode,
        isDefaultBilling: true,
    };
}

type HasAddresses = {
    billingAddress?: Address | null;
    shippingAddress?: Address | null;
    addresses?: Address[]
};

// chọn địa chỉ mặc định, ưu tiên field riêng, rồi tìm trong ds
export const getDefaultBilling = (u?: HasAddresses | null) =>
    u?.billingAddress
    ?? u?.addresses?.find((a) => a.isDefaultShipping)
    ?? u?.addresses?.find((a) => a.isDefault)
    ?? null;

export const getDefaultShipping = (u?: HasAddresses | null) =>
    u?.shippingAddress
    ?? u?.addresses?.find((a) => a.isDefaultShipping)
    ?? u?.addresses?.find((a) => a.isDefault)
    ?? null;

export const formatAddressValue = (v?: Partial<AddressValue> | null) =>
    v ? [v.detail, v.wardName, v.provinceName].filter(Boolean).join(', ') : '';