import React, { useState, useEffect } from "react";
import axios from "axios";
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
        gps: false, // New field for GPS
        gpsCode: "" // New field for GPS code
    });

    useEffect(() => {
        axios.get("http://localhost:5000/api/categories/categories")
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.error("There was an error retrieving the categories!", error);
            });
    }, []);

    const handleAddCategory = () => {
        axios.post("http://localhost:5000/api/categories/add-category", { name: newCategory })
            .then((response) => {
                setCategories([...categories, response.data]);
                setNewCategory("");
                document.getElementById("addCategoryModal").style.display = "none";
            })
            .catch((error) => {
                console.error("There was an error adding the category!", error);
            });
    };

    const handleAddVehicle = (categoryId) => {
        axios.post(`http://localhost:5000/api/categories/add-vehicle/${categoryId}`, vehicle)
            .then((response) => {
                // Update categories state
                setCategories(categories.map(cat => 
                    cat._id === categoryId ? response.data : cat
                ));
    
                // Update selected category locally
                if (selectedCategory && selectedCategory._id === categoryId) {
                    setSelectedCategory(prev => ({
                        ...prev,
                        vehicles: [...prev.vehicles, response.data.vehicles[response.data.vehicles.length - 1]] // Add the new vehicle
                    }));
                }
    
                // Clear the vehicle input fields
                setVehicle({ marque: "", modele: "", couleur: "", plaque: "", gps: false, gpsCode: "" });
            })
            .catch((error) => {
                console.error("There was an error adding the vehicle!", error);
            });
    };
    

    const handleDeleteVehicle = (categoryId, vehicleId) => {
        axios.delete(`http://localhost:5000/api/categories/delete-vehicle/${categoryId}/${vehicleId}`)
            .then((response) => {
                setCategories(categories.map(cat => cat._id === categoryId ? response.data : cat));
                if (selectedCategory && selectedCategory._id === categoryId) {
                    setSelectedCategory(response.data);
                }
            })
            .catch((error) => {
                console.error("There was an error deleting the vehicle!", error);
            });
    };

    return (
        <div className="add-materialM">
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
                        placeholder="Nom de la categorie" 
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
                <div className="vehicle-formM">
                    <h2>Ajouter un véhicule à la catégorie: {selectedCategory.name}</h2>
                    <input 
                        type="text" 
                        placeholder="Marque" 
                        value={vehicle.marque}
                        onChange={(e) => setVehicle({ ...vehicle, marque: e.target.value })}
                    />
                    <input 
                        type="text" 
                        placeholder="Modéle" 
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
                    <label>
                        GPS disponible:
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
                    <button onClick={() => handleAddVehicle(selectedCategory._id)}>Ajouter véhicule</button>
                    
                    <h3>Liste des véhicules pour la catégorie: {selectedCategory.name}</h3>
                    <table className="vehicle-tableM">
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
                            {selectedCategory.vehicles.map((veh, index) => (
                                <tr key={index}>
                                    <td>{veh.marque}</td>
                                    <td>{veh.modele}</td>
                                    <td>{veh.couleur}</td>
                                    <td>{veh.plaque}</td>
                                    <td>{veh.gps ? "Oui" : "Non"}</td>
                                    <td>{veh.gpsCode || "-"}</td>
                                    <td>
                                        <button onClick={() => handleDeleteVehicle(selectedCategory._id, veh._id)}>
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AddMaterial;
