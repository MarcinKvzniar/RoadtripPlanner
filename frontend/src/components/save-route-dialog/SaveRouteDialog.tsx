import React from 'react';
import './SaveRouteDialog.css';

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  tripName: string;
  setTripName: (name: string) => void;
  children: React.ReactNode;
}

const SaveRouteDialog: React.FC<ModalProps> = ({
  title,
  isOpen,
  onClose,
  onSave,
  tripName,
  setTripName,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog">
      <div className="modal-container">
        <h2 className="modal-title">{title}</h2>
        <div className="modal-content">
          {children}
          <input
            type="text"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            placeholder="Enter trip name"
            className="modal-input"
          />
        </div>
        <div className="modal-actions">
          <button className="modal-button cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-button save" onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveRouteDialog;
