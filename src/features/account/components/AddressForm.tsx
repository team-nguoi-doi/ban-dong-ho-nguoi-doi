import React, { useState } from 'react';
import type { AddressFormValues } from '../utils/types';

interface AddressFormProps {
    addressType?: 'shipping' | 'billing';
    initialAddingState?: boolean;
    onBack: () => void;
    onSaveAddress?: (address: AddressFormValues, type: 'shipping' | 'billing') => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({
                                                            addressType = 'shipping',
                                                            initialAddingState = false,
                                                            onBack,
                                                            onSaveAddress,
                                                        }) => {
    const [isAddingNew, setIsAddingNew] = useState<boolean>(initialAddingState);
    const [showSecondLine, setShowSecondLine] = useState<boolean>(false);

    const isShipping = addressType === 'shipping';

    const [formData, setFormData] = useState({
        title: '',
        firstName: '',
        lastName: '',
        street: '',
        addressLine2: '',
        country: 'Switzerland',
        region: '',
        city: '',
        postCode: '',
        phone: '',
        isDefaultShipping: isShipping,
        isDefaultBilling: !isShipping,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formattedAddress: AddressFormValues = {
            fullName: `${formData.title} ${formData.firstName} ${formData.lastName}`.trim(),
            phone: formData.phone,
            streetAddress: formData.street,
            addressLine2: formData.addressLine2 || undefined,
            city: formData.city,
            region: formData.region || undefined,
            country: formData.country,
            postalCode: formData.postCode,
        };

        if (onSaveAddress) {
            onSaveAddress(formattedAddress, addressType);
        }
        onBack();
    };

    if (!isAddingNew) {
        return (
            <div className="address-manager">
                <button type="button" className="btn-back-link" onClick={onBack}>
                    ← Back
                </button>

                <h2 className="page-title">
                    {isShipping ? 'My shipping address' : 'My billing address'}
                </h2>
                <p className="page-subtitle">
                    {isShipping
                        ? 'Please select your default shipping address for all your next order. You can also add a new address.'
                        : 'Please select your default billing address for invoicing. You can also add a new address.'}
                </p>

                <div className="address-grid">
                    <div className="add-address-card" onClick={() => setIsAddingNew(true)}>
                        <div className="add-icon-box">
                            <span className="add-icon">+</span>
                        </div>
                        <p className="add-address-text">Add a new address</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="address-form-page">
            <button type="button" className="btn-back-link" onClick={() => setIsAddingNew(false)}>
                ← Back
            </button>

            <h2 className="page-title">Add a new address</h2>

            <form onSubmit={handleSubmit} className="address-form">
                <div className="form-group full-width">
                    <label>Title *</label>
                    <select name="title" value={formData.title} onChange={handleChange} required>
                        <option value="">Please select</option>
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Ms.">Ms.</option>
                    </select>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>First Name *</label>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Last Name *</label>
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Address (Street, House Number) *</label>
                        <input
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Country / Region *</label>
                        <select name="country" value={formData.country} onChange={handleChange} required>
                            <option value="Switzerland">Switzerland</option>
                            <option value="Vietnam">Vietnam</option>
                            <option value="United States">United States</option>
                            <option value="France">France</option>
                        </select>
                    </div>
                </div>

                {!showSecondLine ? (
                    <button
                        type="button"
                        className="btn-add-line"
                        onClick={() => setShowSecondLine(true)}
                    >
                        + Add another address line
                    </button>
                ) : (
                    <div className="form-group full-width">
                        <label>Address Line 2 (Apartment, Suite, etc.)</label>
                        <input
                            type="text"
                            name="addressLine2"
                            value={formData.addressLine2}
                            onChange={handleChange}
                        />
                    </div>
                )}

                <div className="form-row">
                    <div className="form-group">
                        <label>Region</label>
                        <select name="region" value={formData.region} onChange={handleChange}>
                            <option value="">Please select</option>
                            <option value="Geneva">Geneva</option>
                            <option value="Zurich">Zurich</option>
                            <option value="HCM">Ho Chi Minh City</option>
                            <option value="HN">Ha Noi</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>City *</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Post Code *</label>
                        <input
                            type="text"
                            name="postCode"
                            value={formData.postCode}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone Number *</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="checkbox-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="isDefaultShipping"
                            checked={formData.isDefaultShipping}
                            onChange={handleChange}
                        />
                        <span>Set as the default shipping address</span>
                    </label>

                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="isDefaultBilling"
                            checked={formData.isDefaultBilling}
                            onChange={handleChange}
                        />
                        <span>Set as the default billing address</span>
                    </label>
                </div>

                <button type="submit" className="btn-submit-address">
                    Add address
                </button>
            </form>
        </div>
    );
};