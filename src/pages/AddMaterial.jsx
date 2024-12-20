import React, { useState, useEffect } from "react"; 
import axios from "axios";
import { MdDeleteForever } from "react-icons/md";
import ReactPaginate from 'react-paginate';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/AddMaterial.css';

const AddMaterial = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [vehicle, setVehicle] = useState({
        marque: "",
        modele: "",
        couleur: "",
        plaque: "",
        gps: false,
        gpsCode: ""
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const vehiclesPerPage = 6;

    useEffect(() => {
        axios.get("https://envoices.premiummotorscars.com/api/categories/categories")
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des catégories !", error);
                toast.error("Erreur lors de la récupération des catégories.");
            });
    }, []);

    const handleAddCategory = () => {
        axios.post("https://envoices.premiummotorscars.com/api/categories/add-category", { name: newCategory })
            .then((response) => {
                setCategories([...categories, response.data]);
                setNewCategory("");
                document.getElementById("addCategoryModal").style.display = "none";
                toast.success("Catégorie ajoutée avec succès !");
            })
            .catch((error) => {
                console.error("Erreur lors de l'ajout de la catégorie !", error);
                toast.error("Erreur lors de l'ajout de la catégorie.");
            });
    };

    const handleAddVehicle = (categoryId) => {
        axios.post(`https://envoices.premiummotorscars.com/api/categories/add-vehicle/${categoryId}`, vehicle)
            .then((response) => {
                setCategories(categories.map(cat =>
                    cat._id === categoryId ? response.data : cat
                ));
   
                if (selectedCategory && selectedCategory._id === categoryId) {
                    setSelectedCategory(prev => ({
                        ...prev,
                        vehicles: [...prev.vehicles, response.data.vehicles[response.data.vehicles.length - 1]]
                    }));
                }
   
                setVehicle({ marque: "", modele: "", couleur: "", plaque: "", gps: false, gpsCode: "" });
                toast.success("Véhicule ajouté avec succès !");
            })
            .catch((error) => {
                console.error("Erreur lors de l'ajout du véhicule !", error);
                toast.error("Erreur lors de l'ajout du véhicule.");
            });
    };

    const handleDeleteVehicle = (categoryId, vehicleId) => {
        axios.delete(`https://envoices.premiummotorscars.com/api/categories/delete-vehicle/${categoryId}/${vehicleId}`)
            .then((response) => {
                setCategories(categories.map(cat => cat._id === categoryId ? response.data : cat));
                if (selectedCategory && selectedCategory._id === categoryId) {
                    setSelectedCategory(response.data);
                }
                toast.success("Véhicule supprimé avec succès !");
            })
            .catch((error) => {
                console.error("Erreur lors de la suppression du véhicule !", error);
                toast.error("Erreur lors de la suppression du véhicule.");
            });
    };

    const filteredVehicles = selectedCategory?.vehicles.filter(vehicle =>
        vehicle.marque.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.modele.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const offset = currentPage * vehiclesPerPage;
    const currentPageVehicles = filteredVehicles?.slice(offset, offset + vehiclesPerPage) || [];

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (
        <div className="add-materialM">
            <ToastContainer position="bottom-right" autoClose={5000} />
           
            <h1 className="titleM">Véhicules du service location courte durée</h1>

            <div className="add-categoryM">
                <button onClick={() => document.getElementById("addCategoryModal").style.display = "block"}>
                    Ajouter une nouvelle catégorie
                </button>
            </div>

            <div id="addCategoryModal" className="modalM">
                <div className="modal-contentM">
                    <span className="close" onClick={() => document.getElementById("addCategoryModal").style.display = "none"}>&times;</span>
                    <h2 className="titleSC">Ajouter une nouvelle catégorie</h2>
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Nom de la catégorie"
                    />
                    <button onClick={handleAddCategory}>Ajouter catégorie</button>
                </div>
            </div>

            <h2 className="categories-titleM">Nos Catégories</h2>

            <div className="categoriesM">
                {categories.map(category => (
                    <div
                        key={category._id}
                        className="category-cardM"
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category.name}
                    </div>
                ))}
            </div>

            {selectedCategory && (
                <div className="vehicleformulaire">
                    <h2>Ajouter un véhicule à la catégorie: {selectedCategory.name}</h2>
                    <input
                        type="text"
                        placeholder="Marque"
                        value={vehicle.marque}
                        onChange={(e) => setVehicle({ ...vehicle, marque: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Modèle"
                        value={vehicle.modele}
                        onChange={(e) => setVehicle({ ...vehicle, modele: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Couleur"
                        value={vehicle.couleur}
                        onChange={(e) => setVehicle({ ...vehicle, couleur: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Plaque"
                        value={vehicle.plaque}
                        onChange={(e) => setVehicle({ ...vehicle, plaque: e.target.value })}
                    />
                    <label className="gps">
                        <p>GPS disponible :</p>
                        <input
                            type="checkbox"
                            checked={vehicle.gps}
                            onChange={(e) => setVehicle({ ...vehicle, gps: e.target.checked })}
                        />
                    </label>
                    {vehicle.gps && (
                        <input
                            type="text"
                            placeholder="Code GPS"
                            value={vehicle.gpsCode}
                            onChange={(e) => setVehicle({ ...vehicle, gpsCode: e.target.value })}
                        />
                    )}
                    <input
                        type="submit"
                        value="Ajouter véhicule"
                        onClick={(e) => {
                            e.preventDefault();
                            handleAddVehicle(selectedCategory._id);
                        }}
                    />
                   
                    <h3>Liste des véhicules pour la catégorie: {selectedCategory.name}</h3>

                    <input
                        type="text"
                        placeholder="Rechercher par marque ou modèle"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-bar"
                    />

                    <table className="vehicletableMaterial">
                        <thead>
                            <tr>
                                <th>Marque</th>
                                <th>Modéle</th>
                                <th>Couleur</th>
                                <th>Plaque</th>
                                <th>GPS</th>
                                <th>Code GPS</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPageVehicles.map((veh, index) => (
                                <tr key={index}>
                                    <td>{veh.marque}</td>
                                    <td>{veh.modele}</td>
                                    <td>{veh.couleur}</td>
                                    <td>{veh.plaque}</td>
                                    <td>{veh.gps ? "Oui" : "Non"}</td>
                                    <td>{veh.gpsCode || "-"}</td>
                                    <td>
                                        <button onClick={() => handleDeleteVehicle(selectedCategory._id, veh._id)}>
                                            <MdDeleteForever />
                                        </button>
                                    </td>
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
                        pageCount={Math.ceil((filteredVehicles?.length || 0) / vehiclesPerPage)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName={'pagination3'}
                        activeClassName={'active'}
                    />
                </div>
            )}
        </div>
    );
}

export default AddMaterial;