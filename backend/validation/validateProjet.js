const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function ValidateProject(data) {
    let errors = {};

    data.NomProjet = !isEmpty(data.NomProjet) ? data.NomProjet : "";
    data.DateDébut = !isEmpty(data.DateDébut) ? data.DateDébut : "";
    data.DateFin = !isEmpty(data.DateFin) ? data.DateFin : "";
    data.BudgetConsacré = !isEmpty(data.BudgetConsacré) ? data.BudgetConsacré : "";



    if (validator.isEmpty(data.NomProjet)) {
        errors.NomProjet = "NomProjet is required";
    }

  

    return {
        errors,
        isValid: isEmpty(errors)
    };
};