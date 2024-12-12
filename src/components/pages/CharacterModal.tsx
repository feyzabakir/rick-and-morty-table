import React, { useEffect } from 'react';

// Modal için kullanılacak prop tipleri
interface CharacterModalProps {
  character: {
    name: string;
    image: string;
    status: string;
    species: string;
    gender: string;
    origin: { name: string };
    location: { name: string };
  } | null;
  onClose: () => void;
}

// Modal bileşenini oluşturuyoruz ve TypeScript ile tip güvenliği sağlıyoruz
const CharacterModal: React.FC<CharacterModalProps> = ({ character, onClose }) => {
  useEffect(() => {
    if (character) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [character]);

  if (!character) return null;

  return (
    // Ana modal container'ı - tıklandığında modalı kapatır
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{character.name}</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <img src={character.image} alt={character.name} className="character-image" />
          <div className="character-details">
            <p>
              <strong>Status: </strong>
              <span className={`status-${character.status.toLowerCase()}`}>{character.status}</span>
            </p>
            <p>
              <strong>Species: </strong>{character.species}
            </p>
            <p>
              <strong>Gender: </strong>{character.gender}
            </p>
            <p>
              <strong>Origin: </strong>{character.origin.name}
            </p>
            <p>
              <strong>Location: </strong>{character.location.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterModal;
