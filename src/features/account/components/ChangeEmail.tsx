import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changeEmailVal, type ChangeEmailForm as EmailFormType } from '../utils/validation';
import {useAppDispatch} from "../../../hooks/hooks.ts";
import {changeEmail} from "../accountSlice.ts";

interface ChangeEmailCardProps {
    onOpenModal?: () => void;
}

export const ChangeEmailCard: React.FC<ChangeEmailCardProps> = ({ onOpenModal }) => {
    return (
        <div className="account-card">
            <h3>My Email Address</h3>
            <p>
                In order to change your email address, you will need to enter your current password.
            </p>
            <button type="button" className="btn-secondary" onClick={onOpenModal}>
                Change my Email Address
            </button>
        </div>
    );
};

export const ChangeEmailForm: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [serverError, setServerError] = useState('');
    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<EmailFormType>({
        resolver: zodResolver(changeEmailVal),
        mode: 'onTouched',
    });


    const onSubmit = async (data: EmailFormType) => {
        try {
            setServerError('');
            await dispatch(changeEmail(data)).unwrap();
            alert('Cập nhật email thành công!');
            onBack();
        } catch (err: any) {
            setServerError(err || 'Có lỗi xảy ra khi đổi email.');
        }
    };

    return (
        <div className="account-subview-page">
            <button type="button" className="btn-back" onClick={onBack}>
                ← Back
            </button>

            <h2 className="subview-title">Change my Email Address</h2>

            {serverError && <p className="account__error">{serverError}</p>}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="account-subview-form">
                <div className="form-group full-width">
                    <label>New Email Address *</label>
                    <input
                        type="email"
                        {...register('newEmail')}
                        placeholder="Enter your new email address"
                    />
                    {errors.newEmail && (
                        <p className="account__error">{errors.newEmail.message}</p>
                    )}
                </div>

                <div className="form-group full-width">
                    <label>Current Password *</label>
                    <input
                        type="password"
                        {...register('password')}
                        placeholder="Enter your current password"
                    />
                    {errors.password && (
                        <p className="account__error">{errors.password.message}</p>
                    )}
                </div>

                <button type="submit" className="btn-submit-account" disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Save email address'}
                </button>
            </form>
        </div>
    );
};