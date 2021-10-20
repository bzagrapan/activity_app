import { AnchorButton, RangeSlider } from '@blueprintjs/core';
import _, { filter } from 'lodash';
import React, { useState } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { getActivity } from '../../utils/API';
import { createMenuItemObject } from '../../utils/general';
import ActivityTypeMenu from '../activity-type-menu/ActivityTypeMenu';
import './style.css';

const MainScreen = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [netErrorOccurred, setNetErrorOccurred] = useState(false);
    const [activities, setActivities] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [maxNumberOfParticipants, setMaxNumberOfParticipants] = useState(1);
    const [maxPrice, setMaxPrice] = useState(0);
    const [filters, setFilters] = useState({
        activity_type: null,
        participants: null,
        price: null,
    });

    const getNewActivity = () => {
        setIsLoading(true);
        getActivity()
            .then((activity) => {
                if (menuItems.length !== 0) {
                    let itemIndex = _.findIndex(menuItems, function (o) {
                        return o.text === activity.type;
                    });
                    // -1 === NOT FOUND
                    if (itemIndex === -1) {
                        setMenuItems([
                            ...menuItems,
                            createMenuItemObject(activity.type, menuItemOnClick, activity.type),
                        ]);
                    }
                } else {
                    setMenuItems([createMenuItemObject(activity.type, menuItemOnClick, activity.type)]);
                }
                setActivities([...activities, activity]);
                if (maxNumberOfParticipants < activity.participants) {
                    setMaxNumberOfParticipants(activity.participants);
                }
                setIsLoading(false);
                setNetErrorOccurred(false);
            })
            .catch((e) => {
                console.log(e);
                setNetErrorOccurred(true);
                setIsLoading(false);
            });
    };

    const menuItemOnClick = (type) => {
        let newFilters = _.cloneDeep(filters);
        newFilters.activity_type = type;
        setFilters(newFilters);
    };

    const onParticipantsFilterChange = (range) => {
        let newFilters = _.cloneDeep(filters);
        newFilters.participants = range;
        setFilters(newFilters);
    };

    const renderActivities = () => {
        return activities.map((activity, key) => {
            return (
                <tr key={key}>
                    <td>{activity.createdAt}</td>
                    <td>{activity.type}</td>
                    <td>{activity.participants}</td>
                    <td>{activity.price}</td>
                    <td>{activity.activity}</td>
                    <td>DELETE ICON</td>
                </tr>
            );
        });
    };

    console.log(filters);
    return (
        <div>
            <Container fluid className="app-container">
                <Row>
                    <Col lg={1} md={1}></Col>
                    <Col lg={10} md={10}>
                        <div className="app-header">Activity list</div>
                        <hr />
                    </Col>
                    <Col lg={1} md={1}></Col>
                </Row>
                <Row>
                    <Col lg={1} md={1}></Col>
                    <Col lg={10} md={10}>
                        <ActivityTypeMenu menu_items={menuItems} />
                        <span className="participants-label">Number of participants:</span>
                        <RangeSlider
                            min={1}
                            max={maxNumberOfParticipants}
                            stepSize={1}
                            disabled={activities.length > 0 || maxNumberOfParticipants === 1 ? false : true}
                            className="slider"
                            value={filters.participants ? filters.participants : [1, maxNumberOfParticipants]}
                            onRelease={(range) => onParticipantsFilterChange(range)}
                        />
                        <hr />
                    </Col>
                    <Col lg={1} md={1}></Col>
                </Row>
                <Row>
                    <Col lg={1} md={1}></Col>
                    <Col lg={10} md={10} className="activity-col">
                        <table className="activity-table">
                            <thead>
                                <tr>
                                    <th>Created at</th>
                                    <th>Type</th>
                                    <th>Participants</th>
                                    <th>Price</th>
                                    <th>Activity</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>{renderActivities()}</tbody>
                        </table>
                    </Col>
                    <Col lg={1} md={1}></Col>
                </Row>
                <Row>
                    <Col lg={1} md={1}></Col>
                    <Col lg={10} md={10}>
                        <div className="add-activity-btn-container">
                            <AnchorButton
                                loading={isLoading}
                                disabled={isLoading}
                                text="Add activity"
                                onClick={getNewActivity}
                                intent="primary"
                                className="add-activity-btn"
                            />
                            {netErrorOccurred ? (
                                <div className="error-label">Network error occurred, please try again.</div>
                            ) : null}
                        </div>
                    </Col>
                    <Col lg={1} md={1}></Col>
                </Row>
            </Container>
        </div>
    );
};

export default MainScreen;
