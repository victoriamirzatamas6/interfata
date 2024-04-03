

  const Modal = ({ onClose, children }) => {
    return (
      <div className="modal-backdrop">
        <div className="modal">
          {children}
          <div className="modal-footer">
            <button onClick={onClose}>Close</button>
            
          </div>
        </div>
      </div>
    );
  };
  
  export default Modal;
  