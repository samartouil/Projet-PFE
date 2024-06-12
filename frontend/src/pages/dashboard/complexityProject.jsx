import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';
import request from '../../utils/request';
import './complexityProject.css';

const ProjectComplexityChart = () => {
    const [projectComplexities, setProjectComplexities] = useState([]);

    useEffect(() => {
        fetchProjectComplexities();
    }, []);

    const fetchProjectComplexities = async () => {
        try {
            const response = await request.get('/api/BI/equipements/complexiteProjet');
            
            setProjectComplexities(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des complexités des projets :', error);
        }
    };

    // Extraire les noms des projets et leurs complexités
   
    

    // Configuration du graphique ApexCharts
    const Options = {
        chart: {
            type: 'bar',
            height: 350,
        },
      
        xaxis: {
            categories: projectComplexities.map(project => project.projectName),
            title: {
                text: 'Projets', // Titre de l'axe X
            },
        },
        yaxis: {
            min: 0, // Valeur minimale de l'axe Y
            max: 1,
            title: {
                text: 'Complexité', // Titre de l'axe Y
            },
            labels: {
                formatter: function (value) {
                    return value.toFixed(1); // Afficher un chiffre après la virgule
                }
            }

        },
        colors: ['#800000'],
    };

    // Données pour le graphique
    const Series = [
        {
            name: 'Complexité',
            data: projectComplexities.map(project => project.complexity.toFixed(2))

        },
    ];

    return (
        <div className="project-complexity-chart-container">
        <h2 className="project-complexity-chart-title">Complexité des Projets</h2>
        <ApexCharts options={Options} series={Series} type="bar" height={350} className="project-complexity-chart" />
        </div>
    );
};

export default ProjectComplexityChart;
