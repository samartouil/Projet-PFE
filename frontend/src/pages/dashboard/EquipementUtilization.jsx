import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import request from '../../utils/request';
import "./equipementUtilization.css"

const EquipmentUtilizationChart = () => {
    const [equipmentUtilization, setEquipmentUtilization] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await request.get('/api/BI/equipements/utilisation');
            setEquipmentUtilization(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données du serveur :', error);
        }
    };

    const options = {
        chart: {
            type: 'donut',
            height: 350
        },
        labels: Object.keys(equipmentUtilization),
        dataLabels: {
            enabled: true,
            formatter: (val) => {
                return val.toFixed(2) + '%';
            }
        },
        legend: {
            show: true,
            position: 'bottom'
        }
    };

    const series = Object.values(equipmentUtilization);

    return (
        <div className="equipment-utilization-container">
            <div className="equipment-utilization-chart">
                <h2 className="equipment-utilization-chart-title">Pourcentage d'utilisation des équipements aux projets</h2>
                <Chart options={options} series={series} type="donut" height={350} />
            </div>
           
        </div>
    );
};

export default EquipmentUtilizationChart;
