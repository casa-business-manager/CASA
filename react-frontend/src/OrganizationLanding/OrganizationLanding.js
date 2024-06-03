import React from 'react';
import { useParams } from 'react-router-dom';

const OrganizationLanding = () => {
    const { orgId } = useParams();

    return (
        <div>
            <h1>Organization Landing Page</h1>
            <p>Organization ID: {orgId}</p>
        </div>
    );
};

export default OrganizationLanding;