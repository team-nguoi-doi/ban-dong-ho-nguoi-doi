import React from 'react';

interface ChangeEmailProps {
    onOpenModal?: () => void;
}

export const ChangeEmail: React.FC<ChangeEmailProps> = ({ onOpenModal }) => {
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