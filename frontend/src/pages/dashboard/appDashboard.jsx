import React from 'react';
import PiecePercentagesChart from './PiecePercentageChart';
import "./appDashboard.css"
import EquipmentUtilizationChart from './EquipementUtilization';
import BudgetChart from './BudgetChart';
import ProjectComplexityChart from './complexityProject';

const DashboardBI = () => {
    return (
        <div className="dashboard-container">
            <div className="dashboard-section">
                <div className='twoDivs'>
                    <EquipmentUtilizationChart />
                </div>
                <div className='twoDivs'>
                    <BudgetChart />
                </div>
            </div>
            <div className="dashboard-section">
                <ProjectComplexityChart />
            </div>
            <div className="chart-section">
                <PiecePercentagesChart />
            </div>
        </div>
    );
};

export default DashboardBI;
