import React from 'react';
import { useParams } from 'react-router-dom';

const Imprimefact = () => {
    const { invoiceId } = useParams();

    return (
        <div>
            <h1>Hello, this is the invoice page for {invoiceId}</h1>
            {/* You can display detailed invoice information here using invoiceId */}
        </div>
    );
};

export default Imprimefact;
