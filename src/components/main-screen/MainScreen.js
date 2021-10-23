import { AnchorButton, ControlGroup, FormGroup, Icon, NumericInput } from '@blueprintjs/core';
import { Tooltip2 } from '@blueprintjs/popover2';
import _, { filter } from 'lodash';
import React, { useState } from 'react';
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
    const [formHelperText, setFormHelperText] = useState('');

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
        setFilters((currentFilters) => {
            let newFilters = _.cloneDeep(currentFilters);
            newFilters.activity_type = type;
            return newFilters;
        });
    };

    const onParticipantsFilterChange = (valueAsString, isMin) => {
        let parsedValue = parseFloat(valueAsString);
        if (typeof parsedValue === NaN || parsedValue < 0 || valueAsString === '-') {
            setFormHelperText('Please, write only valid positive numbers into filters.');
        } else {
            let newFilters = _.cloneDeep(filters);
            if (isMin) {
                newFilters.participants.min = valueAsString;
            } else {
                newFilters.participants.max = valueAsString;
            }
            setFilters(newFilters);
            setFormHelperText('');
        }
    };

    const onPriceFilterChange = (valueAsString, isMin) => {
        let parsedValue = parseFloat(valueAsString);
        if (typeof parsedValue === NaN || parsedValue < 0 || valueAsString === '-') {
            setFormHelperText('Please, write only valid positive numbers into filters.');
        } else {
            let newFilters = _.cloneDeep(filters);
            if (isMin) {
                newFilters.price.min = valueAsString;
            } else {
                newFilters.price.max = valueAsString;
            }
            setFilters(newFilters);
            setFormHelperText('');
        }
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

        if (!isStringEmpty(filters.participants.min) && activity.participants < parseFloat(filters.participants.min)) {
            areParticipantsOk = false;
        }

        if (!isStringEmpty(filters.participants.max) && activity.participants > parseFloat(filters.participants.max)) {
            areParticipantsOk = false;
        }

        return isTypeOk && isPriceOk && areParticipantsOk ? true : false;
    };

    const deleteActivity = (activity_id) => {
        let newActivities = _.filter(activities, function (o) {
            return o.id !== activity_id;
        });
        setActivities(newActivities);

        let newActivitiesToDisplay = _.filter(activitiesToDisplay, function (n) {
            return n.id !== activity_id;
        });
        setActivitiesToDisplay(newActivitiesToDisplay);
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
                    <td>
                        <Tooltip2 content={`Delete action created at ${activity.createdAt}`} intent="danger">
                            <Icon
                                intent="danger"
                                icon="trash"
                                className="trash-icon"
                                onClick={() => deleteActivity(activity.id)}
                            />
                        </Tooltip2>
                    </td>
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
                                        onValueChange={(valueAsNumber, valueAsString) =>
                                            onParticipantsFilterChange(valueAsString, true)
                                        }
                                        stepSize={1}
                                        value={filters.participants.min}
                                        disabled={activities.length === 0 ? true : false}
                                    />
                                    <NumericInput
                                        placeholder="Maximal value"
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
                    </Col>
                    <Col lg={1} md={1}></Col>
                </Row>
                {!isStringEmpty(formHelperText) ? (
                    <Row justify="center">
                        <div className="helper-text">{formHelperText}</div>
                    </Row>
                ) : null}
                <Row>
                    <Col lg={1} md={1}></Col>
                    <Col lg={10} md={10} className="activity-col">
                        <hr />
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
                                icon="add"
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
