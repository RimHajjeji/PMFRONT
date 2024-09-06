import React from 'react';
import "../style/Dashboard.css";

const Dashboard = () => {
    return (
        <div className="dashboard-container-wrapper">
            <div className="dashboard-main-content">
                <div className="dashboard-content-wrapper">
                    <div className="welcome-card">
                        <div className="welcome-text">
                            <h5>Bienvenue Admin! 🎉</h5>
                        </div>
                        <div className="welcome-image">
                            <img src="/assets/admindash.jpg" alt="Man working on laptop" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
