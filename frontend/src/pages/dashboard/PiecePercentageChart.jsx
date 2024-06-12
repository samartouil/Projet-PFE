import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import request from '../../utils/request';
import "./piecePercentageChart.css";


const PiecePercentagesChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await request.get('/api/BI/equipements/piece-percentages');
            setData(response.data.map(item => ({
                nom: item.nom,
                pourcentageDefaillantes: item.pourcentageDefaillantes,
                pourcentageNonDefaillantes: item.pourcentageNonDefaillantes
            })));
        } catch (error) {
            console.error('Erreur lors de la récupération des données du serveur :', error);
        }
    };

    const options = {
        // Options de configuration du graphique (titre, axes, légendes, etc.)
        title: {
            text: 'Pourcentages de pièces défaillantes et non défaillantes'
        },
        chart: {
            type: 'bar',
            // Inversez les axes pour afficher les barres horizontales
            stacked: true,
            toolbar: {
                show: false
            }
        },

        plotOptions: {
            bar: {
                horizontal: true // Barres horizontales
            }
        },

    };

    const series = [
        {
            name: 'Pourcentage de pièces défaillantes',
            data: data.map(item => ({
                x: item.nom,
                y: item.pourcentageDefaillantes +"%"
            }))
        },
        {
            name: 'Pourcentage de pièces non défaillantes',
            data: data.map(item => ({
                x: item.nom,
                y: item.pourcentageNonDefaillantes
            }))
        }
    ];

    return (
        <div className="chart-container">
            <h2 className="chart-title">Pourcentages de pièces défaillantes et non défaillantes</h2>
            <Chart options={options} series={series} type="bar" height={data.length * 50} className="piece-percentages-chart" />
        </div>
    );
};

export default PiecePercentagesChart;
