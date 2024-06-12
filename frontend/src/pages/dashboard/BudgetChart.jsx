import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import request from '../../utils/request';
import "./budgetChart.css";

const BudgetChart = () => {
    const [budgetsData, setBudgetsData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await request.get('/api/BI/equipements/budgetPlusUtilise');
            setBudgetsData(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données du serveur :', error);
        }
    };

    const options = {
        chart: {
            type: 'line', 
            height: 500
        },
        xaxis: {
            categories: budgetsData.map(budget => budget.budgetName), // Utiliser les noms des budgets
            labels: {
                rotate: -45,
                offsetY: 5,
            
            }
        },
        yaxis: {
            title: {
                text: 'Fréquence d\'utilisation'
            }
        }
    };

    const series = [{
        name: 'Fréquence',
        data: budgetsData.map(budget => budget.frequency)
    }];

    // Afficher le graphique uniquement si les données sont disponibles
    return (
        <div className="budget-chart-container">
            <h2 className="budget-chart-title">Budgets les plus utilisés pour les équipements</h2>
            {budgetsData.length > 0 && <Chart options={options} series={series} type="line" height={350} className="budget-chart" />}
        </div>
    );
};

export default BudgetChart;
