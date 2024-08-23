import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/AddClient.css';

const AddClient = () => {
    const [showForm, setShowForm] = useState(false);
    const [clients, setClients] = useState([]);
    const [clientData, setClientData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: ''
    });

    const toggleForm = () => setShowForm(!showForm);

    const handleChange = (e) => {
        setClientData({ ...clientData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/clients/add', clientData);
            setClients([...clients, response.data]);
            setClientData({ firstName: '', lastName: '', phone: '', email: '' });
            setShowForm(false);
        } catch (error) {
            console.error('Error adding client', error);
        }
    };

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/clients');
                setClients(response.data);
            } catch (error) {
                console.error('Error fetching clients', error);
            }
        };

        fetchClients();
    }, []);

    return (
        <div className="add-client-page">
            <h1 className="title">Ajouter des Clients</h1>
            <button className="btn-toggle-form" onClick={toggleForm}>
                Ajouter Client
            </button>

            {showForm && (
                <div className="client-form-container"> {/* Added a container around the form */}
                    <form className="client-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="Prénom"
                            value={clientData.firstName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Nom"
                            value={clientData.lastName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Numéro de Téléphone"
                            value={clientData.phone}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={clientData.email}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit">Enregistrer</button>
                    </form>
                </div>
            )}

            <table className="client-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>Numéro de Téléphone</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client, index) => (
                        <tr key={client._id}>
                            <td>{index + 1}</td>
                            <td>{client.firstName}</td>
                            <td>{client.lastName}</td>
                            <td>{client.phone}</td>
                            <td>{client.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AddClient;
