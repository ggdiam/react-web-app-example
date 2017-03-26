/**
 * Created by Alexander Sveshnikov on 21/11/16.
 */
import React from 'react';
import { Link } from 'react-router';

const PageNotFound = () => {
    return (
        <div className="page-404">
            <h4>
                404 Страница не найдена
            </h4>
            <Link to="/"> На главную </Link>
        </div>
    );
};

export default PageNotFound;
