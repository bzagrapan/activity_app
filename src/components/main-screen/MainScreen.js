import { AnchorButton, Slider } from '@blueprintjs/core';
import _ from 'lodash';
import React, { useState } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { getActivity } from '../../utils/API';
import { createMenuItemObject } from '../../utils/general';
import ActivityTypeMenu from '../activity-type-menu/ActivityTypeMenu';
import './style.css';

const MainScreen = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [activities, setActivities] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [filters, setFilters] = useState({});

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
                setIsLoading(false);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const menuItemOnClick = (type) => {
        console.log(type);
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
                        <AnchorButton
                            loading={isLoading}
                            disabled={isLoading}
                            text="Add activity"
                            onClick={getNewActivity}
                            intent="primary"
                            className="add-activity-btn"
                        />
                    </Col>
                    <Col lg={1} md={1}></Col>
                </Row>
            </Container>
        </div>
    );
};

export default MainScreen;
