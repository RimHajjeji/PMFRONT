// Gestion des calculs
const calculateTotalHT = () => {
  return rentedVehicles.reduce((total, vehicle) => {
    const dailyRate = Number(vehicle.dailyRate || 0);
    const daysRented = Number(vehicle.daysRented || 0);
    return total + dailyRate * daysRented;
  }, 0);
};

const calculateTotalHTFrais = () => {
  const fraisSupplémentaires =
    Number(fraisCarburant) +
    Number(fraisKilometrage) +
    Number(fraisLivraison) +
    Number(fraisChauffeur);
  return calculateTotalHT() + fraisSupplémentaires;
};

const calculateTVA = () => {
  return calculateTotalHTFrais() * 0.18;
};

const calculateCSS = () => {
  return calculateTotalHTFrais() * 0.01;
};

const calculateTotalTTC = () => {
  return calculateTotalHTFrais() + calculateTVA() + calculateCSS();
};

const calculateRemise = () => {
  return (discountPercentage * calculateTotalTTC()) / 100;
};

const calculateTotalNet = () => {
  const totalTTC = calculateTotalTTC();
  const remise = calculateRemise();
  const deduction = remise + Number(acompte) + Number(montantRemboursement);
  return totalTTC - deduction;
};

// Mise à jour des champs calculés
useEffect(() => {
  setValue("totalHT", calculateTotalHT());
  setValue("totalHTFrais", calculateTotalHTFrais());
  setValue("tva", calculateTVA());
  setValue("css", calculateCSS());
  setValue("totalTTC", calculateTotalTTC());
  setValue("remise", calculateRemise());
  setValue("totalNet", calculateTotalNet());
}, [
  rentedVehicles,
  fraisCarburant,
  fraisKilometrage,
  fraisLivraison,
  fraisChauffeur,
  discountPercentage,
  acompte,
  montantRemboursement,
]);
