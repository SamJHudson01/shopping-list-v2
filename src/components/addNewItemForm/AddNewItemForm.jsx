/**
 * `NewItemForm` is a robust and interactive form component purposefully built for managing the addition of 
 * new items within an application. The design of this component is centered around two main elements: an input 
 * field and a submission button.
 * 
 * The input field serves as an interactive element where users can enter the name of the new item they want to 
 * add. The submission button is designed to accept the user's input and submit the form data. 
 * 
 * The component comes with several callback functions, passed as props, that  provide custom behavior at different 
 * stages of interaction - from the moment of entering data into the input field to the actual submission of the form. 
 * 
 * It offers a high level of customization, allowing it to fit seamlessly into a variety of application contexts and user workflows.
 *
 * @component
 * @param {Object} props - Contains the properties passed down to the `NewItemForm` component.
 * @param {Function} props.handleSubmit - Callback function invoked upon form submission.
 * @param {Function} props.handleNewItemChange - Callback function triggered when the input field value changes. 
 * @param {Function} props.handleBlur - Callback function invoked when the input field loses focus.
 * @param {string} props.newItem - Represents the current value in the input field.
 */

import { useRef, useState } from 'react';
import './newItemForm.css';
import { Button } from '@mantine/core';
import { Plus } from 'tabler-icons-react';

const NewItemForm = ({ handleSubmit, handleNewItemChange, handleBlur, newItem, newItemInputIsFocused, handleOnFocus, handleNewItemButtonClick }) => {
    const newItemInputRef = useRef(null);
    const blurTimeout = useRef(null);
    const [errors, setErrors] = useState(null);


    /**
    * `handleDelayedBlur` is a function that enhances the user experience by delaying 
    * the reaction to onBlur events on the input field of `NewItemForm` by 100 milliseconds. 
    * This delay prevents immediate processing of rapid user interactions, avoiding potential disruptions. 
    * The function employs a timeout stored in `blurTimeout` reference, which gets cleared before 
    * setting a new one. Once the delay expires, if the `newItem` length is less than 2, 
    * `handleBlur` prop function is called, enabling the execution of custom logic for incomplete item names.
    */
    const handleDelayedBlur = () => {
        clearTimeout(blurTimeout.current);

        blurTimeout.current = setTimeout(() => {
            if (newItem.length < 2) {
                handleBlur();
            }
        }, 100);
    };



    /**
      * Handles the click event on the form submission button.
      * If newItem's length is less than 2, the event is prevented and the input field is focused.
      * Else, handleNewItemButtonClick is called with the event object.
      * 
      * @param {Event} e - The click event object.
      */
    const handleClick = (e) => {
        if (newItem.length < 2) {
            e.preventDefault();
            clearTimeout(blurTimeout.current);
            newItemInputRef.current.focus();
        } else {
            handleNewItemButtonClick(e);
        }
    };

    return (
        <form className="shopping-list__new-item-form" onSubmit={handleSubmit}>
            <div className="shopping-list__add-new-item-input-container">
                <input
                    ref={newItemInputRef}
                    className={`shopping-list__add-new-item-input ${newItemInputIsFocused && newItem.length < 2 ? 'shopping-list__add-new-item-input--error' : ''}`}
                    type="text"
                    id="newItem"
                    value={newItem}
                    onChange={handleNewItemChange}
                    placeholder="Add new item"
                    onFocus={handleOnFocus}
                    onBlur={handleDelayedBlur}
                />
                <Button
                    className="shopping-list__add-new-item-button"
                    type="submit"
                    onClick={handleClick}
                >
                    <Plus />
                </Button>
            </div>
        </form>
    );
};

export default NewItemForm;
