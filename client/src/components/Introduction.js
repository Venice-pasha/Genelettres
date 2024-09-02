import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Introduction = ({ navigateToHome }) => {
    const [introContent, setIntroContent] = useState(null);
    // get from server intro data
    useEffect(() => {
        axios.get('/api/intro')
            .then(response => {
                console.log(response.data); 
                setIntroContent(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the intro content!', error);
            });
    }, []);

    console.log('IntroContent state:', introContent); 

    return (
        <div>
            <h1>{introContent ? introContent.t : 'Loading...'}</h1>
            <h4>{introContent ? introContent.t1 : ''}</h4>
            <p>{introContent ? introContent.c1 : ''}</p>
            <h4>{introContent ? introContent.t2 : ''}</h4>
            <p>{introContent ? introContent.c2 : ''}</p>
            <h4>{introContent ? introContent.t3 : ''}</h4>
            <p>{introContent ? introContent.c3 : ''}</p>
            <button onClick={navigateToHome}>Back to Home</button>
        </div>
    );
};

export default Introduction;

