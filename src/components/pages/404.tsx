import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-code">404</div>
        <h1 className="error-title">Page Not Found</h1>
        <p className="error-message">
        The page you are looking for may have been moved, deleted or never existed.
        </p>
        <button className="back-home-button" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Back to Home Page
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