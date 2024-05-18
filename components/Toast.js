import React from 'react';

const Toast=(props)=> {
    return (
      <div>
        <div className="toast toast-top toast-end z-50">
          <div className="alert alert-info">
            <span>Product Added to the Cart</span>
          </div>
          
        </div>
      </div>
    );
}

export default Toast;