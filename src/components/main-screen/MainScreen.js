import { AnchorButton, Card } from '@blueprintjs/core';
import _ from 'lodash';
import React, { useState } from 'react';
import { getActivity } from '../../utils/API';
import './style.css';

const MainScreen = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [activities, setActivities] = useState([]);
    const [filters, setFilters] = useState({});

    const getNewActivity = () => {
        setIsLoading(true);
        getActivity().then((activity) => {
            setActivities([...activities, activity]);
            setIsLoading(false);
        });
    };

    const displayActivities = () => {
        return activities.map((activity) => {
            return (
                <Card elevation={2} key={activity.key} className="activity-card">
                    <div className="activity-detail-row">
                        <b>ACTIVITY: </b>
                        <span>{activity.activity}</span>
                    </div>
                    <div className="activity-detail-row">
                        <b>TYPE: </b>
                        <span>{activity.type}</span>
                    </div>
                    <div className="activity-detail-row">
                        <b>PRICE: </b>
                        <span>{activity.price}</span>
                    </div>
                    <div>
                        <b>PARTICIPANTS: </b>
                        <span>{activity.participants}</span>
                    </div>
                </Card>
            );
        });
    };

    return (
        <div className="app-container">
            <div className="app-header">Activity application</div>
            <hr />
            <div className="control-bar">
                <AnchorButton
                    loading={isLoading}
                    disabled={isLoading}
                    text="Add activity"
                    onClick={getNewActivity}
                    intent="primary"
                    className="add-activity-btn"
                />
            </div>
            <div className="activity-container">{displayActivities()}</div>
        </div>
    );
};

export default MainScreen;
