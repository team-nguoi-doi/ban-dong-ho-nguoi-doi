import './AddressFields.css';

import type {AddressOption, AddressValue} from "../utils/types.ts";
import {useProvinces, useWards} from "../useAddressSlice.ts";

import type {ChangeEvent} from "react";

// idPrefix chỉ để id các ô không trùng khi dùng nhiều bộ trên cùng một trang
export interface AddressFieldsProps {
    idPrefix: string;
    value: AddressValue;
    onChange: (addressValue: AddressValue) => void;
}

function withSelected(options: AddressOption[], code: string, label: string) {
    if(!code || options.some((o) => o.code === code)) return options;
    return [{code, label}, ...options]
}

function AddressFields({ idPrefix, value, onChange }: AddressFieldsProps) {
    const provinces = useProvinces();
    const provincesOptions = withSelected(provinces.options, value.provinceCode, value.provinceName);

    const wards = useWards(value.provinceCode || null);
    const wardOptions = withSelected(wards.options, value.wardCode, value.wardName);

    const handleProvince = (e: ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        const province = provincesOptions.find((p) => p.code === code);
        onChange({
            ...value,
            provinceCode: code,
            provinceName: province?.label ?? '',
            wardCode: '',   // đổi tỉnh thì xóa xã đã chọn
            wardName: '',
        });
    };

    const handleWard = (e: ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value
        const ward = wardOptions.find((w) => w.code === code)
        onChange({
            ...value,
            wardCode: code,
            wardName: ward?.label ?? '' })
    }

    return (
        <div className="address-fields">
            <div className="address-fields__field">
                <label htmlFor={`${idPrefix}-province`} className="address-fields__label">
                    Tỉnh / Thành phố <span className="address-fields__required">*</span>
                </label>
                <select id={`${idPrefix}-province`}
                        value={value.provinceCode}
                        onChange={handleProvince}
                        className="address-fields__select">
                    <option value="">
                        {provinces.loading ? 'Đang tải...' :
                        'Chọn tỉnh / thành phố'}
                    </option>
                    {provincesOptions.map((p) => (
                        <option key={p.code} value={p.code}>{p.label}</option>
                    ))}
                </select>
            </div>

            <div className="address-fields__field">
                <label htmlFor={`${idPrefix}-ward`} className="address-fields__label">
                    Xã / Phường <span className="address-fields__required">*</span>
                </label>
                <select id={`${idPrefix}-ward`}
                        className="address-fields__select"
                        value={value.wardCode}
                        onChange={handleWard}
                        disabled={!value.provinceCode}>
                    <option value="">{!value.provinceCode ? 'Chọn tỉnh / thành phố trước' :
                        wards.loading ? 'Đang tải...' : 'Chọn xã / phường'}
                    </option>
                    {wardOptions.map((w) => (
                        <option key={w.code} value={w.code}>{w.label}</option>
                    ))}
                </select>
                {wards.error && (
                    <p className="address-fields__error" role="alert">
                        Không tải được danh sách xã / phường.{' '}
                        <button type="button" className="address-fields__retry" onClick={wards.retry}>
                            Thử lại
                        </button>
                    </p>
                )}
            </div>

            <div className="address-fields__field">
                <label htmlFor={`${idPrefix}-detail`} className="address-fields__label">
                    Địa chỉ chi tiết <span className="address-fields__required">*</span>
                </label>
                <input
                    id={`${idPrefix}-detail`}
                    type="text"
                    className="address-fields__input"
                    placeholder="Số nhà, tên đường, thôn/xóm..."
                    autoComplete="street-address"
                />
            </div>
        </div>
    )
}

export default AddressFields