import { AnchorButton, ControlGroup, FormGroup, NumericInput } from '@blueprintjs/core';
import _, { filter } from 'lodash';
import React, { useState, useRef } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { getActivity } from '../../utils/API';
import { createMenuItemObject, isStringEmpty } from '../../utils/general';
import ActivityTypeMenu from '../activity-type-menu/ActivityTypeMenu';
import './style.css';

const MainScreen = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [netErrorOccurred, setNetErrorOccurred] = useState(false);
    const [activities, setActivities] = useState([]);
    const [activitiesToDisplay, setActivitiesToDisplay] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [filters, setFilters] = useState({
        activity_type: '',
        participants: { min: '', max: '' },
        price: { min: '', max: '' },
        isFilterApplied: false,
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

                if (filters.isFilterApplied) {
                    if (isActivityOkByFilters(activity)) {
                        setActivitiesToDisplay([...activitiesToDisplay, activity]);
                    }
                } else {
                    setActivitiesToDisplay([...activitiesToDisplay, activity]);
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

    const onParticipantsFilterChange = (valueAsString, isMin) => {
        let newFilters = _.cloneDeep(filters);
        if (isMin) {
            newFilters.participants.min = valueAsString;
        } else {
            newFilters.participants.max = valueAsString;
        }
        setFilters(newFilters);
    };

    const onPriceFilterChange = (valueAsString, isMin) => {
        let newFilters = _.cloneDeep(filters);
        if (isMin) {
            newFilters.price.min = valueAsString;
        } else {
            newFilters.price.max = valueAsString;
        }
        setFilters(newFilters);
    };

    const onFilterReset = () => {
        setFilters({
            activity_type: '',
            participants: { min: '', max: '' },
            price: { min: '', max: '' },
            isFilterApplied: false,
        });
        setActivitiesToDisplay(activities);
    };

    const onFilterApply = () => {
        let displayedActivities = [];
        _.forEach(activities, (activity) => {
            if (isActivityOkByFilters(activity)) {
                displayedActivities.push(activity);
            }
        });

        setActivitiesToDisplay(displayedActivities);

        let newFilter = _.cloneDeep(filters);
        newFilter.isFilterApplied = true;
        setFilters(newFilter);
    };

    const isActivityOkByFilters = (activity) => {
        let isTypeOk = true;
        let isPriceOk = true;
        let areParticipantsOk = true;

        if (!isStringEmpty(filters.activity_type) && filters.activity_type !== activity.type) {
            isTypeOk = false;
        }

        if (!isStringEmpty(filters.price.min) && activity.price < parseFloat(filters.price.min)) {
            isPriceOk = false;
        }

        if (!isStringEmpty(filters.price.max) && activity.price > parseFloat(filters.price.max)) {
            isPriceOk = false;
        }

        if (!isStringEmpty(filters.participants.min) && activity.participants < parseInt(filters.participants.min)) {
            areParticipantsOk = false;
        }

        if (!isStringEmpty(filters.participants.max) && activity.participants > parseInt(filters.participants.max)) {
            areParticipantsOk = false;
        }

        return isTypeOk && isPriceOk && areParticipantsOk ? true : false;
    };

    const renderActivities = () => {
        return activitiesToDisplay.map((activity, key) => {
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
                        <ActivityTypeMenu menu_items={menuItems} menu_text={filters.activity_type} />
                        <div className="filter-container">
                            <FormGroup inline={true} label="Number of participants:" className="custom-form-group">
                                <ControlGroup>
                                    <NumericInput
                                        placeholder="Minimal value"
                                        allowNumericCharactersOnly
                                        onValueChange={(valueAsNumber, valueAsString) =>
                                            onParticipantsFilterChange(valueAsString, true)
                                        }
                                        stepSize={1}
                                        value={filters.participants.min}
                                        disabled={activities.length === 0 ? true : false}
                                    />
                                    <NumericInput
                                        placeholder="Maximal value"
                                        allowNumericCharactersOnly
                                        onValueChange={(valueAsNumber, valueAsString) =>
                                            onParticipantsFilterChange(valueAsString, false)
                                        }
                                        stepSize={1}
                                        value={filters.participants.max}
                                        disabled={activities.length === 0 ? true : false}
                                    />
                                </ControlGroup>
                            </FormGroup>
                        </div>
                        <div className="filter-container">
                            <FormGroup inline={true} label="Price:" className="custom-form-group">
                                <ControlGroup>
                                    <NumericInput
                                        placeholder="Minimal value"
                                        allowNumericCharactersOnly
                                        onValueChange={(valueAsNumber, valueAsString) =>
                                            onPriceFilterChange(valueAsString, true)
                                        }
                                        stepSize={0.05}
                                        minorStepSize={0.01}
                                        value={filters.price.min}
                                        disabled={activities.length === 0 ? true : false}
                                    />
                                    <NumericInput
                                        placeholder="Maximal value"
                                        allowNumericCharactersOnly
                                        onValueChange={(valueAsNumber, valueAsString) =>
                                            onPriceFilterChange(valueAsString, false)
                                        }
                                        stepSize={0.05}
                                        minorStepSize={0.01}
                                        value={filters.price.max}
                                        disabled={activities.length === 0 ? true : false}
                                    />
                                </ControlGroup>
                            </FormGroup>
                        </div>
                        <AnchorButton
                            className="submit-filter-btn"
                            intent="primary"
                            text="Filter"
                            icon="search"
                            onClick={onFilterApply}
                            disabled={activities.length === 0 ? true : false}
                        />
                        <AnchorButton
                            className="clear-btn"
                            intent="danger"
                            text="Reset"
                            icon="cross"
                            onClick={onFilterReset}
                            disabled={activities.length === 0 ? true : false}
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
                        <div className="total-items-container">
                            <table className="total-items-table">
                                <thead>
                                    <tr>
                                        <th>Total activities:</th>
                                        <td>{`${activities.length}`}</td>
                                    </tr>
                                    <tr>
                                        <th>Displayed activities:</th>
                                        <td>{`${activitiesToDisplay.length}`}</td>
                                    </tr>
                                </thead>
                            </table>
                        </div>
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
