import React from 'react';
import './Popup.css';
const Popup = ({errorPopupMsg,successPopupMsg}) => {
  return (
    <div className='popupContainer'>
      {errorPopupMsg != "" && <div className='errorPopup'>{errorPopupMsg}</div>}
      {successPopupMsg != "" && <div className='successPopup'>{successPopupMsg}</div>}
    </div>
  );
};

export default Popup;
