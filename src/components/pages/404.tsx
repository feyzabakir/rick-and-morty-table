import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-code">404</div>
        <h1 className="error-title">Sayfa Bulunamadı</h1>
        <p className="error-message">
          Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
        </p>
        <button className="back-home-button" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Ana Sayfaya Dön
        </button>
      </div>
      <div className="error-image">
        <img
          src="/images/404.png"
          alt="404 Illustration"
          width={400}
          height={400}
        />
      </div>
    </div>
  );
};

export default NotFoundPage;