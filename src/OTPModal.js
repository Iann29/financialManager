import React from 'react';
import Modal from './Modal'; 

const OTPModal = ({ show, onClose, otpData, setOtpData, onSubmit }) => {
  const handleChange = (e) => {
    setOtpData({ ...otpData, [e.target.name]: e.target.value });
  };

  return (
    <Modal show={show} onClose={onClose}>
      <div className="otp-modal-content">
        <h2>Verificação OTP</h2>
        <input
          type="text"
          name="otp"
          value={otpData.otp}
          onChange={handleChange}
          placeholder="Insira o código OTP"
        />
        <button onClick={onSubmit}>Verificar</button>
      </div>
    </Modal>
  );
};

export default OTPModal;
