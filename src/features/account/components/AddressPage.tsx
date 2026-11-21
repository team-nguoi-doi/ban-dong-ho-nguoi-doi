import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { AddressForm, type SimpleAddressFormValues } from './AddressForm';
import { updateUserAddresses } from '../accountSlice';
import { updateProfile } from '../../auth/authSlice';
import type { Address } from '../utils/types';

export function AddressPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);
    const addresses = user?.addresses || [];

    const handleSaveAddress = async (values: SimpleAddressFormValues, type: 'shipping' | 'billing') => {
        if (!user) return;

        const isShipping = type === 'shipping';
        const newAddress: Address = {
            id: values.id || Date.now().toString(),
            fullName: values.fullName,
            phone: values.phone,
            streetAddress: values.streetAddress,
            provinceCode: values.provinceCode,
            city: values.provinceName,
            wardCode: values.wardCode,
            region: values.wardName,
            country: 'Việt Nam',
            isDefaultShipping: isShipping ? values.isDefault : false,
            isDefaultBilling: !isShipping ? values.isDefault : false,
        };

        let updatedList = [...addresses];

        if (values.isDefault) {
            updatedList = updatedList.map((addr) => ({
                ...addr,
                ...(isShipping ? { isDefaultShipping: false } : { isDefaultBilling: false }),
            }));
        }

        if (values.id) {
            updatedList = updatedList.map((addr) => (addr.id === values.id ? newAddress : addr));
        } else {
            if (updatedList.length === 0) {
                newAddress.isDefaultShipping = true;
                newAddress.isDefaultBilling = true;
            }
            updatedList.push(newAddress);
        }

        await dispatch(updateUserAddresses(updatedList)).unwrap();
        await dispatch(updateProfile({ id: user.id, changes: { addresses: updatedList } })).unwrap();
    };

    const handleSetDefault = async (addressId: string) => {
        if (!user) return;
        const updatedList = addresses.map((addr) => ({
            ...addr,
            isDefaultShipping: addr.id === addressId,
            isDefaultBilling: addr.id === addressId,
        }));
        await dispatch(updateUserAddresses(updatedList)).unwrap();
        await dispatch(updateProfile({ id: user.id, changes: { addresses: updatedList } })).unwrap();
    };

    const handleDeleteAddress = async (addressId: string) => {
        if (!user) return;
        const updatedList = addresses.filter((addr) => addr.id !== addressId);
        await dispatch(updateUserAddresses(updatedList)).unwrap();
        await dispatch(updateProfile({ id: user.id, changes: { addresses: updatedList } })).unwrap();
    };

    return (
        <AddressForm
            addressType="shipping"
            addresses={addresses}
            onBack={() => navigate('/account')}
            onSaveAddress={handleSaveAddress}
            onSetDefault={handleSetDefault}
            onDeleteAddress={handleDeleteAddress}
        />
    );
}