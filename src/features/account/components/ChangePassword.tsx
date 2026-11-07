import React from 'react';

interface ChangePasswordProps {
    onOpenModal?: () => void;
}

export const ChangePassword: React.FC<ChangePasswordProps> = ({ onOpenModal }) => {
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