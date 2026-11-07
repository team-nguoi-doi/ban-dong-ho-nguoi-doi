import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordVal, type ChangePasswordForm as PasswordFormType } from '../utils/validation';
import {changePassword} from "../accountSlice.ts";
import {useAppDispatch} from "../../../hooks/hooks.ts";

interface ChangePasswordCardProps {
    onOpenModal?: () => void;
}

export const ChangePasswordCard: React.FC<ChangePasswordCardProps> = ({ onOpenModal }) => {
    return (
        <div className="account-card">
            <h3>My password</h3>
            <p>
                In order to change your password, you will need to enter your current password.
            </p>
            <button type="button" className="btn-secondary" onClick={onOpenModal}>
                Change my password
            </button>
        </div>
    );
};

export const ChangePasswordForm: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);
    const [serverError, setServerError] = useState('');
    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<PasswordFormType>({
        resolver: zodResolver(changePasswordVal),
        mode: 'onTouched',
    });

    const onSubmit = async (data: PasswordFormType) => {
        try {
            setServerError('');
            await dispatch(changePassword(data)).unwrap();
            alert('Cập nhật mật khẩu thành công!');
            onBack();
        } catch (err: any) {
            setServerError(err || 'Có lỗi xảy ra khi đổi mật khẩu.');
        }
    };

    return (
        <div className="account-subview-page">
            <button type="button" className="btn-back" onClick={onBack}>
                ← Back
            </button>

            <h2 className="subview-title">Change my password</h2>

            {serverError && <p className="account__error">{serverError}</p>}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="account-subview-form">
                <div className="form-group full-width">
                    <label>Password *</label>
                    <div className="input-password-wrapper">
                        <input
                            type={showCurrentPw ? 'text' : 'password'}
                            {...register('currentPassword')}
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            className="btn-eye"
                            onClick={() => setShowCurrentPw(!showCurrentPw)}
                        >
                            👁
                        </button>
                    </div>
                    {errors.currentPassword && (
                        <p className="account__error">{errors.currentPassword.message}</p>
                    )}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>New Password *</label>
                        <div className="input-password-wrapper">
                            <input
                                type={showNewPw ? 'text' : 'password'}
                                {...register('newPassword')}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="btn-eye"
                                onClick={() => setShowNewPw(!showNewPw)}
                            >
                                👁
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="account__error">{errors.newPassword.message}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Confirm your password *</label>
                        <div className="input-password-wrapper">
                            <input
                                type={showConfirmPw ? 'text' : 'password'}
                                {...register('confirmPassword')}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="btn-eye"
                                onClick={() => setShowConfirmPw(!showConfirmPw)}
                            >
                                👁
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="account__error">{errors.confirmPassword.message}</p>
                        )}
                    </div>
                </div>

                <button type="submit" className="btn-submit-account" disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Change my password'}
                </button>
            </form>
        </div>
    );
};