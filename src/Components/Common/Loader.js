import React from 'react';
import { Spinner } from 'reactstrap';

const Loader = () => {
    return (
        <div className="d-flex justify-content-center mx-2 mt-2">
            <Spinner color="primary"> Loading... </Spinner>
        </div>
    );
};

export default Loader;
