import React from 'react';
import { Link } from 'react-router-dom';
import { pageRoutes } from '../routes/PageRoutes';

const PageNotFound = () => {
    return (
        <section className="ct_login_bg min-vh-100 d-flex align-items-center justify-content-center">
            <div className="container text-center">
                <h1 className="display-1 fw-bold ct_green_text">404</h1>
                <h2 className="mb-3">Page Not Found</h2>
                <p className="text-muted mb-4">The page you are looking for doesn't exist or has been moved.</p>
                <Link to={pageRoutes.myProfile} className="btn ct_green_btn px-4 py-2">
                    Back to Profile
                </Link>
            </div>
        </section>
    );
};

export default PageNotFound;
