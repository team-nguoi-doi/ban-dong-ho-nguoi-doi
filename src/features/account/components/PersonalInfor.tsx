import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks.ts";
import { useForm } from "react-hook-form";
import { type PersonalInfoForm, personalInfoVal } from "../utils/validation.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Address, PersonalInfo } from "../utils/types.ts";
import { updateUserProfile } from "../accountSlice.ts";
import { ChangeEmail } from "./ChangeEmail.tsx";
import { ChangePassword } from "./ChangePassword.tsx";
import { AddressForm } from "./AddressForm.tsx";

export const PersonalInfor: React.FC = () => {
    const [serverError, setServerError] = useState("");

    const [addressState, setAddressState] = useState<{
        mode: 'none' | 'select' | 'add';
        type: 'shipping' | 'billing';
    }>({
        mode: 'none',
        type: 'shipping',
    });

    const user = useAppSelector((state) => state.auth.user) as PersonalInfo | null;
    const dispatch = useAppDispatch();

    const shippingAddress = user?.shippingAddress;
    const billingAddress = user?.billingAddress;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<PersonalInfoForm>({
        resolver: zodResolver(personalInfoVal),
        defaultValues: {
            title: user?.title || "Ms.",
            fullName: user?.fullName || '',
            phone: user?.phone || '',
            dateOfBirth: user?.dateOfBirth || '',
        },
    });

    const onSubmit = async (values: PersonalInfoForm) => {
        try {
            setServerError("");
            await dispatch(updateUserProfile(values)).unwrap();
            alert("Cập nhật thông tin thành công!");
        } catch (message) {
            setServerError(typeof message === "string" ? message : "Có lỗi xảy ra");
        }
    };

    const handleSaveAddress = (newAddress: Address, type: 'shipping' | 'billing') => {
        console.log(`Địa chỉ mới đã tạo cho [${type}]:`, newAddress);
    };

    if (addressState.mode !== 'none') {
        return (
            <AddressForm
                addressType={addressState.type}
                initialAddingState={addressState.mode === 'add'}
                onBack={() => setAddressState((prev) => ({ ...prev, mode: 'none' }))}
                onSaveAddress={handleSaveAddress}
            />
        );
    }

    return (
        <div className="personal-infor">
            <h2>My personal information</h2>
            <p>In this section, you can find and edit your profile and addresses.
                You can also change your password and email.</p>

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
                    <ChangePassword onOpenModal={() => console.log("Open Password Modal")} />
                    <ChangeEmail onOpenModal={() => console.log("Open Email Modal")} />
                </div>
            </div>

            <div className="my-addresses-section">
                <h3>My addresses</h3>

                <div className="addresses-grid">
                    <div className="account-card">
                        <h4>Shipping address:</h4>
                        {shippingAddress ? (
                            <div className="address-details">
                                <p><strong>{shippingAddress.fullName}</strong></p>
                                <p>{shippingAddress.streetAddress}</p>
                                {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                                <p>
                                    {shippingAddress.city}
                                    {shippingAddress.region ? `, ${shippingAddress.region}` : ''}, {shippingAddress.country}
                                </p>
                                <p>Tel: {shippingAddress.phone}</p>
                            </div>
                        ) : (
                            <p className="card-empty">No shipping address yet</p>
                        )}

                        <div className="address-actions">
                            <button
                                type="button"
                                className="btn-link"
                                onClick={() => setAddressState({ mode: 'select', type: 'shipping' })}
                            >
                                Select a default shipping address
                            </button>
                            <button
                                type="button"
                                className="btn-link"
                                onClick={() => setAddressState({ mode: 'add', type: 'shipping' })}
                            >
                                Add a shipping address
                            </button>
                        </div>
                    </div>

                    <div className="account-card">
                        <h4>Billing address:</h4>
                        {billingAddress ? (
                            <div className="address-details">
                                <p><strong>{billingAddress.fullName}</strong></p>
                                <p>{billingAddress.streetAddress}</p>
                                {billingAddress.addressLine2 && <p>{billingAddress.addressLine2}</p>}
                                <p>
                                    {billingAddress.city}
                                    {billingAddress.region ? `, ${billingAddress.region}` : ''}, {billingAddress.country}
                                </p>
                                <p>Tel: {billingAddress.phone}</p>
                            </div>
                        ) : (
                            <p className="card-empty">No billing address yet</p>
                        )}

                        <div className="address-actions">
                            <button
                                type="button"
                                className="btn-link"
                                onClick={() => setAddressState({ mode: 'select', type: 'billing' })}
                            >
                                Select a default billing address
                            </button>
                            <button
                                type="button"
                                className="btn-link"
                                onClick={() => setAddressState({ mode: 'add', type: 'billing' })}
                            >
                                Add a billing address
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};