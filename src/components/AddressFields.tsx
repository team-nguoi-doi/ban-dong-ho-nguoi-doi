import type {AddressFieldsProps} from "../utils/types.ts";
import './AddressFields.css';

function AddressFields({ idPrefix }: AddressFieldsProps) {
    return (
        <div className="address-fields">
            <div className="address-fields__field">
                <label htmlFor={`${idPrefix}-province`} className="address-fields__label">
                    Tỉnh / Thành phố <span className="address-fields__required">*</span>
                </label>
                <select id={`${idPrefix}-province`} className="address-fields__select">
                    <option value="">Chọn tỉnh / thành phố</option>
                    {/* Dữ liệu mẫu để xem giao diện, sau này lấy từ API */}
                    <option value="1">Thành phố Hồ Chí Minh</option>
                    <option value="2">Thành phố Hà Nội</option>
                    <option value="3">Thành phố Đà Nẵng</option>
                </select>
            </div>

            <div className="address-fields__field">
                <label htmlFor={`${idPrefix}-ward`} className="address-fields__label">
                    Xã / Phường <span className="address-fields__required">*</span>
                </label>
                <select id={`${idPrefix}-ward`} className="address-fields__select" disabled>
                    <option value="">Chọn tỉnh / thành phố trước</option>
                </select>
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