import { AnchorButton } from '@blueprintjs/core';
import _ from 'lodash';
import React, { useState } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { getActivity } from '../../utils/API';
import './style.css';
import * as dayjs from 'dayjs';

const MainScreen = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [activities, setActivities] = useState([]);
    const [filters, setFilters] = useState({});

    const getNewActivity = () => {
        setIsLoading(true);
        getActivity()
            .then((activity) => {
                setActivities([...activities, activity]);
                setIsLoading(false);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const displayActivities = () => {
        return activities.map((activity) => {
            return (
                <tr key={activity.key}>
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
                        Filters
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
                            <tbody>{displayActivities()}</tbody>
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
