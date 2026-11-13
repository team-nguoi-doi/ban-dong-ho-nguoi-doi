import React, { useState, useEffect } from 'react';
import type { Address } from '../utils/types.ts';

export interface Province {
    code: number;
    name: string;
    districts: District[];
}

export interface District {
    code: number;
    name: string;
}

export interface SimpleAddressFormValues {
    id?: string;
    fullName: string;
    phone: string;
    provinceCode: string;
    districtCode: string;
    fullCityDistrict: string;
    streetAddress: string;
    labelAs: 'Home' | 'Work';
    isDefault: boolean;
}

interface FormErrors {
    fullName?: string;
    phone?: string;
    provinceCode?: string;
    districtCode?: string;
    streetAddress?: string;
}

interface AddressFormProps {
    addressType?: 'shipping' | 'billing';
    addresses?: Address[];
    initialAddingState?: boolean;
    onBack: () => void;
    onSaveAddress?: (address: SimpleAddressFormValues, type: 'shipping' | 'billing') => Promise<void> | void;
    onSetDefault?: (addressId: string) => void;
    onDeleteAddress?: (addressId: string) => void;
}

const defaultFormState: SimpleAddressFormValues = {
    fullName: '',
    phone: '',
    provinceCode: '',
    districtCode: '',
    fullCityDistrict: '',
    streetAddress: '',
    labelAs: 'Home',
    isDefault: false,
};

export const AddressForm: React.FC<AddressFormProps> = ({
                                                            addressType = 'shipping',
                                                            addresses = [],
                                                            initialAddingState = false,
                                                            onBack,
                                                            onSaveAddress,
                                                            onSetDefault,
                                                            onDeleteAddress,
                                                        }) => {
    const isShipping = addressType === 'shipping';

    const [viewMode, setViewMode] = useState<'list' | 'form'>(
        initialAddingState ? 'form' : 'list'
    );

    const [provinces, setProvinces] = useState<Province[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [formData, setFormData] = useState<SimpleAddressFormValues>(defaultFormState);
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                setIsLoading(true);
                const res = await fetch('https://provinces.open-api.vn/api/?depth=2');
                const data = await res.json();
                setProvinces(data);
            } catch (error) {
                console.error('Lỗi khi tải danh sách địa chính:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLocations();
    }, []);

    const selectedProvince = provinces.find((p) => p.code.toString() === formData.provinceCode);
    const availableDistricts = selectedProvince ? selectedProvince.districts : [];

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Vui lòng nhập họ và tên';
        }

        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (!formData.phone.trim()) {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Số điện thoại không hợp lệ (VD: 0912345678)';
        }

        if (!formData.provinceCode) {
            newErrors.provinceCode = 'Vui lòng chọn Tỉnh / Thành phố';
        }

        if (!formData.districtCode) {
            newErrors.districtCode = 'Vui lòng chọn Quận / Huyện';
        }

        if (!formData.streetAddress.trim()) {
            newErrors.streetAddress = 'Vui lòng nhập địa chỉ cụ thể (Số nhà, tên đường)';
        } else if (formData.streetAddress.trim().length < 5) {
            newErrors.streetAddress = 'Địa chỉ quá ngắn (tối thiểu 5 ký tự)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const provCode = e.target.value;
        setFormData((prev) => ({
            ...prev,
            provinceCode: provCode,
            districtCode: '',
            fullCityDistrict: '',
        }));
        if (errors.provinceCode) setErrors((prev) => ({ ...prev, provinceCode: undefined }));
    };

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const distCode = e.target.value;
        const distObj = availableDistricts.find((d) => d.code.toString() === distCode);

        setFormData((prev) => ({
            ...prev,
            districtCode: distCode,
            fullCityDistrict: selectedProvince && distObj ? `${selectedProvince.name}, ${distObj.name}` : '',
        }));
        if (errors.districtCode) setErrors((prev) => ({ ...prev, districtCode: undefined }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleEditClick = (addr: Address) => {
        const isCurrentDefault = isShipping ? addr.isDefaultShipping : addr.isDefaultBilling;

        setFormData({
            id: addr.id,
            fullName: addr.fullName,
            phone: addr.phone,
            provinceCode: '',
            districtCode: '',
            fullCityDistrict: addr.city || '',
            streetAddress: addr.streetAddress || '',
            labelAs: 'Home',
            isDefault: !!isCurrentDefault,
        });
        setErrors({});
        setViewMode('form');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        if (onSaveAddress) {
            await onSaveAddress(formData, addressType);
        }
        setFormData(defaultFormState);
        setViewMode('list');
    };

    if (viewMode === 'list') {
        return (
            <div className="address-manager">
                <button type="button" className="btn-back-link" onClick={onBack}>
                    ← Back
                </button>

                <h2 className="page-title">
                    {isShipping ? 'My shipping address' : 'My billing address'}
                </h2>
                <p className="page-subtitle">
                    Please select your default {isShipping ? 'shipping' : 'billing'} address for all your next order. You can also add a new address.
                </p>

                <div className="address-grid">
                    <div
                        className="add-address-card"
                        onClick={() => {
                            setFormData(defaultFormState);
                            setErrors({});
                            setViewMode('form');
                        }}
                    >
                        <div className="add-icon-box">
                            <span className="add-icon">+</span>
                        </div>
                        <span className="add-address-text">Add a new address</span>
                    </div>

                    {addresses.map((addr) => {
                        const isCurrentDefault = isShipping ? addr.isDefaultShipping : addr.isDefaultBilling;

                        return (
                            <div key={addr.id} className={`account-card ${isCurrentDefault ? 'default-card' : ''}`}>
                                {isCurrentDefault && <span className="badge-default">Default</span>}
                                <h4>{addr.fullName}</h4>
                                <p>{addr.streetAddress || 'Chưa nhập số nhà'}</p>
                                <p>{addr.city}, {addr.country}</p>
                                <p>Tel: {addr.phone}</p>

                                <div className="address-card__actions">
                                    <div className="address-card__actions-left">
                                        {!isCurrentDefault && onSetDefault && (
                                            <button
                                                type="button"
                                                className="btn-action-link btn-set-default"
                                                onClick={() => addr.id && onSetDefault(addr.id)}
                                            >
                                                Set as default
                                            </button>
                                        )}
                                    </div>

                                    <div className="address-card__actions-right">
                                        <button
                                            type="button"
                                            className="btn-action-link btn-edit"
                                            onClick={() => handleEditClick(addr)}
                                        >
                                            Edit
                                        </button>

                                        {onDeleteAddress && (
                                            <button
                                                type="button"
                                                className="btn-action-link btn-delete"
                                                onClick={() => {
                                                    if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
                                                        addr.id && onDeleteAddress(addr.id);
                                                    }
                                                }}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="address-form-container">
            <button
                type="button"
                className="btn-back-link"
                onClick={() => {
                    setFormData(defaultFormState);
                    setErrors({});
                    setViewMode('list');
                }}
            >
                ← Back
            </button>

            <h2 className="address-form-title">
                {formData.id
                    ? (isShipping ? 'Edit Shipping Address' : 'Edit Billing Address')
                    : (isShipping ? 'New Shipping Address' : 'New Billing Address')}
            </h2>

            <form onSubmit={handleSubmit} className="simple-address-form" noValidate>
                <div className="form-row">
                    <div className="form-group">
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Full Name *"
                            className={errors.fullName ? 'input-error' : ''}
                        />
                        {errors.fullName && <p className="field-error-text" style={{ color: 'red', fontSize: '12px' }}>{errors.fullName}</p>}
                    </div>

                    <div className="form-group">
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone Number *"
                            className={errors.phone ? 'input-error' : ''}
                        />
                        {errors.phone && <p className="field-error-text" style={{ color: 'red', fontSize: '12px' }}>{errors.phone}</p>}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <select
                            name="provinceCode"
                            value={formData.provinceCode}
                            onChange={handleProvinceChange}
                            disabled={isLoading}
                            className={errors.provinceCode ? 'input-error' : ''}
                        >
                            <option value="" disabled hidden>
                                {isLoading ? 'Loading cities...' : 'City / Province *'}
                            </option>
                            {provinces.map((province) => (
                                <option key={province.code} value={province.code}>
                                    {province.name}
                                </option>
                            ))}
                        </select>
                        {errors.provinceCode && <p className="field-error-text" style={{ color: 'red', fontSize: '12px' }}>{errors.provinceCode}</p>}
                    </div>

                    <div className="form-group">
                        <select
                            name="districtCode"
                            value={formData.districtCode}
                            onChange={handleDistrictChange}
                            disabled={!formData.provinceCode || isLoading}
                            className={errors.districtCode ? 'input-error' : ''}
                        >
                            <option value="" disabled hidden>
                                {formData.provinceCode ? 'District *' : 'Select City first'}
                            </option>
                            {availableDistricts.map((district) => (
                                <option key={district.code} value={district.code}>
                                    {district.name}
                                </option>
                            ))}
                        </select>
                        {errors.districtCode && <p className="field-error-text" style={{ color: 'red', fontSize: '12px' }}>{errors.districtCode}</p>}
                    </div>
                </div>

                <div className="form-group full-width">
                    <input
                        type="text"
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleChange}
                        placeholder="Street Name, Building, House No. *"
                        className={errors.streetAddress ? 'input-error' : ''}
                    />
                    {errors.streetAddress && <p className="field-error-text" style={{ color: 'red', fontSize: '12px' }}>{errors.streetAddress}</p>}
                </div>

                <div className="label-as-section">
                    <span className="label-as-title">Label As:</span>
                    <div className="label-as-buttons">
                        <button
                            type="button"
                            className={`btn-label-tag ${formData.labelAs === 'Home' ? 'active' : ''}`}
                            onClick={() => setFormData((prev) => ({ ...prev, labelAs: 'Home' }))}
                        >
                            Home
                        </button>
                        <button
                            type="button"
                            className={`btn-label-tag ${formData.labelAs === 'Work' ? 'active' : ''}`}
                            onClick={() => setFormData((prev) => ({ ...prev, labelAs: 'Work' }))}
                        >
                            Work
                        </button>
                    </div>
                </div>

                <div className="checkbox-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="isDefault"
                            checked={formData.isDefault}
                            onChange={handleChange}
                        />
                        Set as Default Address
                    </label>
                </div>

                <div className="address-form-footer">
                    <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => {
                            setFormData(defaultFormState);
                            setErrors({});
                            setViewMode('list');
                        }}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="btn-submit">
                        {formData.id ? 'Update Address' : 'Submit'}
                    </button>
                </div>
            </form>
        </div>
    );
};