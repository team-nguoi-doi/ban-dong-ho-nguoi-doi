import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks.ts";
import { useForm } from "react-hook-form";
import { type PersonalInfoForm, personalInfoVal } from "../utils/validation.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Address, PersonalInfo } from "../utils/types.ts";
import { updateUserProfile, updateUserAddresses } from "../accountSlice.ts";
import { ChangeEmailCard, ChangeEmailForm } from "./ChangeEmail.tsx";
import { ChangePasswordCard, ChangePasswordForm } from "./ChangePassword.tsx";
import { AddressForm, type SimpleAddressFormValues } from "./AddressForm.tsx";

export const PersonalInfor: React.FC = () => {
    const [serverError, setServerError] = useState("");
    const [subView, setSubView] = useState<'none' | 'password' | 'email'>('none');

    const [addressState, setAddressState] = useState<{
        mode: 'none' | 'select' | 'add';
        type: 'shipping' | 'billing';
    }>({
        mode: 'none',
        type: 'shipping',
    });

    const user = useAppSelector((state) => state.auth.user) as PersonalInfo | null;
    const dispatch = useAppDispatch();

    const shippingAddress =
        user?.shippingAddress ||
        user?.addresses?.find((a) => a.isDefaultShipping) ||
        user?.addresses?.[0];

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<PersonalInfoForm>({
        resolver: zodResolver(personalInfoVal),
        mode: 'onTouched',
        defaultValues: {
            title: user?.title || "Ms.",
            fullName: user?.fullName || '',
            phone: user?.phone || '',
            dateOfBirth: user?.dateOfBirth || '',
        },
    });

    useEffect(() => {
        if (user) {
            reset({
                title: user.title || "Ms.",
                fullName: user.fullName || '',
                phone: user.phone || '',
                dateOfBirth: user.dateOfBirth || '',
            });
        }
    }, [user, reset]);

    const onSubmit = async (values: PersonalInfoForm) => {
        try {
            setServerError("");
            await dispatch(updateUserProfile(values)).unwrap();
            alert("Cập nhật thông tin thành công!");
        } catch (message) {
            setServerError(typeof message === "string" ? message : "Có lỗi xảy ra");
        }
    };

    const handleSaveAddress = async (
        formData: SimpleAddressFormValues,
        type: 'shipping' | 'billing'
    ) => {
        const currentAddresses: Address[] = user?.addresses || [];
        let updatedList: Address[] = [];

        if (formData.id) {
            updatedList = currentAddresses.map((addr) => {
                if (addr.id === formData.id) {
                    return {
                        ...addr,
                        fullName: formData.fullName,
                        phone: formData.phone,
                        streetAddress: formData.streetAddress,
                        city: formData.fullCityDistrict || addr.city,
                        isDefaultShipping: type === 'shipping' ? formData.isDefault : addr.isDefaultShipping,
                        isDefaultBilling: type === 'billing' ? formData.isDefault : addr.isDefaultBilling,
                    };
                }
                if (formData.isDefault) {
                    return {
                        ...addr,
                        ...(type === 'shipping' ? { isDefaultShipping: false } : { isDefaultBilling: false }),
                    };
                }
                return addr;
            });
        } else {
            const isFirstAddress = currentAddresses.length === 0;
            const newAddress: Address = {
                id: `addr_${Date.now()}`,
                fullName: formData.fullName,
                phone: formData.phone,
                streetAddress: formData.streetAddress,
                city: formData.fullCityDistrict,
                country: 'Vietnam',
                isDefaultShipping: isFirstAddress || (type === 'shipping' ? formData.isDefault : false),
                isDefaultBilling: isFirstAddress || (type === 'billing' ? formData.isDefault : false),
            };

            updatedList = [...currentAddresses];

            if (formData.isDefault) {
                updatedList = updatedList.map((addr) => ({
                    ...addr,
                    ...(type === 'shipping' ? { isDefaultShipping: false } : { isDefaultBilling: false }),
                }));
            }

            updatedList.push(newAddress);
        }

        try {
            await dispatch(updateUserAddresses(updatedList)).unwrap();
            alert(formData.id ? "Đã cập nhật địa chỉ thành công!" : "Đã thêm địa chỉ thành công!");
            setAddressState((prev) => ({ ...prev, mode: 'none' }));
        } catch (error: any) {
            alert(error || "Không thể lưu địa chỉ");
        }
    };

    const handleDeleteAddress = async (addressId: string) => {
        const currentAddresses: Address[] = user?.addresses || [];

        let updatedList = currentAddresses.filter((addr) => addr.id !== addressId);

        if (updatedList.length > 0) {
            const hasDefaultShipping = updatedList.some((a) => a.isDefaultShipping);
            if (!hasDefaultShipping) {
                updatedList[0] = { ...updatedList[0], isDefaultShipping: true };
            }
        }

        try {
            await dispatch(updateUserAddresses(updatedList)).unwrap();
            alert("Đã xóa địa chỉ thành công!");
        } catch (error: any) {
            alert(error || "Không thể xóa địa chỉ");
        }
    };

    const handleSetDefault = async (addressId: string, type: 'shipping' | 'billing') => {
        const currentAddresses: Address[] = user?.addresses || [];
        const updatedList = currentAddresses.map((addr) => ({
            ...addr,
            isDefaultShipping: type === 'shipping' ? addr.id === addressId : addr.isDefaultShipping,
            isDefaultBilling: type === 'billing' ? addr.id === addressId : addr.isDefaultBilling,
        }));

        try {
            await dispatch(updateUserAddresses(updatedList)).unwrap();
        } catch (error: any) {
            alert(error || "Không thể đổi địa chỉ mặc định");
        }
    };

    if (subView === 'password') {
        return <ChangePasswordForm onBack={() => setSubView('none')} />;
    }

    if (subView === 'email') {
        return <ChangeEmailForm onBack={() => setSubView('none')} />;
    }

    if (addressState.mode !== 'none') {
        return (
            <AddressForm
                addressType={addressState.type}
                addresses={user?.addresses || []}
                initialAddingState={addressState.mode === 'add'}
                onBack={() => setAddressState((prev) => ({ ...prev, mode: 'none' }))}
                onSaveAddress={handleSaveAddress}
                onSetDefault={(addrId) => handleSetDefault(addrId, addressState.type)}
                onDeleteAddress={handleDeleteAddress}
            />
        );
    }

    return (
        <div className="personal-infor">
            <h2>My personal information</h2>
            <p>
                In this section, you can find and edit your profile and addresses.
                You can also change your password and email.
            </p>

            <div className="grid-layout">
                <form className="info-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    {serverError && <p className="account__error">{serverError}</p>}

                    <div className="form-group">
                        <label>Email *</label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="input-disabled"
                        />
                    </div>

                    <div className="form-group">
                        <label>Title *</label>
                        <select {...register('title')}>
                            <option value="Ms.">Ms.</option>
                            <option value="Mr.">Mr.</option>
                            <option value="Other">Other</option>
                        </select>
                        {errors.title && <p className="account__error">{errors.title.message}</p>}
                    </div>

                    <div className="form-group">
                        <label>Full Name *</label>
                        <input
                            type="text"
                            {...register('fullName')}
                            placeholder="Enter your full name"
                        />
                        {errors.fullName && <p className="account__error">{errors.fullName.message}</p>}
                    </div>

                    <div className="form-group">
                        <label>Phone *</label>
                        <input
                            type="tel"
                            {...register('phone')}
                            placeholder="Enter your phone"
                        />
                        {errors.phone && <p className="account__error">{errors.phone.message}</p>}
                    </div>

                    <div className="form-group">
                        <label>Date of Birth *</label>
                        <input
                            type="date"
                            {...register('dateOfBirth')}
                            placeholder="Enter your date of birth"
                        />
                        {errors.dateOfBirth && <p className="account__error">{errors.dateOfBirth.message}</p>}
                    </div>

                    <button className="update-account" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Updating..." : "Update my account"}
                    </button>
                </form>

                <div className="account-cards-column">
                    <ChangePasswordCard onOpenModal={() => setSubView('password')} />
                    <ChangeEmailCard onOpenModal={() => setSubView('email')} />
                </div>
            </div>

            <div className="my-addresses-section">
                <h3>Addresses, Banks & Cards</h3>

                <div className="addresses-grid">
                    <div className="account-card">
                        <h4>My addresses</h4>

                        {shippingAddress ? (
                            <div className="address-details">
                                <p><strong>{shippingAddress.fullName || user?.fullName || 'Full Name'}</strong></p>
                                <p>{shippingAddress.streetAddress || 'No street address specified'}</p>
                                {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                                <p>
                                    {shippingAddress.city || 'City/Province'}, {shippingAddress.country || 'Vietnam'}
                                </p>
                                <p>Tel: {shippingAddress.phone || user?.phone || 'N/A'}</p>
                            </div>
                        ) : (
                            <p className="card-empty">No addresses yet</p>
                        )}

                        <div className="address-actions">
                            <button
                                type="button"
                                className="btn-link"
                                onClick={() =>
                                    setAddressState({
                                        mode: user?.addresses && user.addresses.length > 0 ? 'select' : 'add',
                                        type: 'shipping',
                                    })
                                }
                            >
                                {shippingAddress ? 'Manage my addresses' : 'Add an address'}
                            </button>
                        </div>
                    </div>

                    <div className="account-card">
                        <h4>Banks & Cards</h4>
                        <p className="card-empty">No saved payment methods yet</p>
                        <div className="address-actions">
                            <button
                                type="button"
                                className="btn-link"
                                onClick={() => alert('Chức năng thêm thẻ/ngân hàng đang phát triển')}
                            >
                                Add a bank account or card
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};