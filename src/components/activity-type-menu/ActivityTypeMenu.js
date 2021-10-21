import React, { useState } from 'react';
import './style.css';
import { Menu, PopoverInteractionKind, Button, MenuItem } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { isStringEmpty } from '../../utils/general';

/* This component expects items array as a prop.
   It should look like this:
   menu_items = [
       {
           text: "something",
           on_click: this.handleClick, //a function from parent component
           on_click_parameter: // some value here
       }
   ]
*/
const ActivityTypeMenu = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleInteraction = (nextOpenState) => {
        setIsOpen(nextOpenState);
    };

    const renderMenu = (items) => {
        return items.map((item, key) => {
            return <MenuItem key={key} text={item.text} onClick={() => item.on_click(item.on_click_parameter)} />;
        });
    };

    let { menu_items, menu_text, style, fill } = props;

    let popoverContent = <Menu style={style}>{renderMenu(menu_items)}</Menu>;

    return (
        <Popover2
            content={popoverContent}
            position="bottom-left"
            interactionKind={PopoverInteractionKind.CLICK}
            isOpen={isOpen}
            onInteraction={(state) => handleInteraction(state)}
            canEscapeKeyClose={true}
            fill={fill}
        >
            <Button
                text={isStringEmpty(menu_text) ? 'Select activity type' : menu_text}
                intent="primary"
                disabled={menu_items.length > 0 ? false : true}
                icon="caret-down"
                className="activity-dropdown-btn"
            />
        </Popover2>
    );
};

export default ActivityTypeMenu;
