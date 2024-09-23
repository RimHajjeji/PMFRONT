import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import '../style/AddClient.css';

const AddClient = () => {
    const [showForm, setShowForm] = useState(false);
    const [clients, setClients] = useState([]);
    const [clientData, setClientData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        codeClient: '',
        typeClient: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0); // État pour la page actuelle
    const clientsPerPage = 5; // Nombre de clients par page

    const toggleForm = () => setShowForm(!showForm);

    const handleChange = (e) => {
        setClientData({ ...clientData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/clients/add', clientData);
            setClients([...clients, response.data]);
            setClientData({
                firstName: '',
                lastName: '',
                phone: '',
                email: '',
                codeClient: '',
                typeClient: ''
            });
            setShowForm(false);
        } catch (error) {
            console.error('Error adding client', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
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

    // Filtrer les clients en fonction du terme de recherche
    const filteredClients = clients.filter(client =>
        client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination : calculer les clients pour la page actuelle
    const offset = currentPage * clientsPerPage;
    const currentPageClients = filteredClients.slice(offset, offset + clientsPerPage);

    // Gestion du changement de page
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (
        <div className="add-client-pageC">
            <h1 className="titleC">Ajouter des clients</h1>
            <button className="btn-toggle-formC" onClick={toggleForm}>
                Ajouter Client
            </button>

            {showForm && (
                <div className="client-form-containerC">
                    <form className="client-formC" onSubmit={handleSubmit}>
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
                        {/* Champs pour "code client" et "type client" */}
                        <input
                            type="text"
                            name="codeClient"
                            placeholder="Code Client"
                            value={clientData.codeClient}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="typeClient"
                            placeholder="Type Client"
                            value={clientData.typeClient}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit">Enregistrer Client</button>
                    </form>
                </div>
            )}

            <div className="client-table-containerC">
                <h1 className="client-table-titleC">Liste des clients</h1>
                <div className="search-bar-containerC">
                    <input
                        type="text"
                        className="search-barC"
                        placeholder="Rechercher par nom..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <FaSearch className="search-iconC" />
                </div>
                <table className="client-tableC">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Prénom</th>
                            <th>Nom</th>
                            <th>Numéro de Téléphone</th>
                            <th>Email</th>
                            <th>Code Client</th>
                            <th>Type Client</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPageClients.map((client, index) => (
                            <tr key={client._id}>
                                <td>{offset + index + 1}</td> {/* Index ajusté avec offset */}
                                <td>{client.firstName}</td>
                                <td>{client.lastName}</td>
                                <td>{client.phone}</td>
                                <td>{client.email}</td>
                                <td>{client.codeClient}</td>
                                <td>{client.typeClient}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Pagination */}
                <ReactPaginate
                    previousLabel={'Précédent'}
                    nextLabel={'Suivant'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={Math.ceil(filteredClients.length / clientsPerPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination2'}
                    activeClassName={'active'}
                />
            </div>
        </div>
    );
};

export default AddClient;
