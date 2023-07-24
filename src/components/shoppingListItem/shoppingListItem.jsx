/**
 * ShoppingListItem is a React component that encapsulates the functionality and structure of an individual shopping list item. 
 * It is primarily designed to provide user interactions for each item in a shopping list application. 
 * The rendered item includes a checkbox to toggle its 'completed' status, an editable field to modify the item's name, 
 * and buttons for saving changes, switching to edit mode, and deleting the item.
 * 
 * This component is built to be used in a list context, where multiple instances of ShoppingListItem will be created 
 * based on the shopping list data. The state and behavior of each item are isolated, ensuring the interaction with one item 
 * doesn't affect others.
 * 
 * The style of the component changes depending on whether the item is in the 'edit mode' or 'display mode'. 
 * In 'edit mode', the item name is presented in an input field with a save button, allowing users to modify the item's name. 
 * In 'display mode', the item's name is presented as plain text with an edit button. The component dynamically switches between 
 * these two modes based on user interactions and provided props.
 * 
 * This component relies on several callback functions and state variables passed as props from its parent component, 
 * ensuring that stateful logic can be maintained and manipulated at a higher level, while ShoppingListItem focuses on presenting 
 * the item and capturing user interactions.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.item - The shopping list item object. It should contain at least `id`, `name`, and `completed` properties.
 * @param {string|number} props.editId - The id of the item currently being edited. If `editId` matches `item.id`, the item is in edit mode.
 * @param {string} props.editValue - The current value of the edit input field. It's used when the item is in edit mode.
 * @param {Object} props.editInputRef - A reference object created by `React.createRef()` or `useRef()`. It's used to programmatically focus the input field.
 * @param {Object} props.blurTimeout - A reference object to store the timeout id for the blur event. It's used to handle onBlur and onClick event conflicts.
 * @param {Function} props.handleEdit - The function called when the edit button is clicked. It should set `editId` and `editValue`.
 * @param {Function} props.handleUpdate - The function called when the save button is clicked. It should update the item and exit the edit mode.
 * @param {Object} props.updateItemMutation - The mutation function (could be from a library like react-query or apollo-client) used to update the item on the server.
 * @param {Object} props.deleteItemMutation - The mutation function used to delete the item from the server.
 * @param {Function} props.setEditValue - The state setter function used to update `editValue`.
 * @param {Function} props.setEditId - The state setter function used to update `editId`.
 */


import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const ShoppingListItem = ({ item, editId, editValue, editInputRef, blurTimeout, handleEdit,
                            handleUpdate, updateItemMutation, deleteItemMutation, setEditValue, 
                            setEditId }) => {
    /**
   * This is a handler function that responds to the 'onChange' event triggered by the user input in the edit input field. 
   * It extracts the current value from the input field and calls the `setEditValue` function, which updates the value of the `editValue` state.
   * 
   * This function is vital to create a controlled component by keeping the `editValue` state in sync with the input field. 
   * This makes it possible to have instant access to the current value of the input field and better control over it.
   * 
   * @function
   * @name handleEditValueChange
   * @param {Object} event - The event object automatically passed by the 'onChange' event listener. It contains information about the event.
   * @property {Object} event.target - The DOM element that triggered the event, which is the input field in this case.
   * @property {string} event.target.value - The current value of the input field when the 'onChange' event was triggered.
   */
    const handleEditValueChange = event => {
        setEditValue(event.target.value);
    };

    return (
        <div key={item.id} className={`shopping-list__item ${editId === item.id && editValue.length < 2 ? 'shopping-list__item--error' : ''}`}>
            <input
                className="shopping-list__item-checkbox"
                type="checkbox"
                checked={item.completed}
                onChange={() => {
                    updateItemMutation.mutate({
                        ...item,
                        completed: !item.completed
                    });
                }}
            />
            {editId === item.id ? (
                <input
                    ref={editInputRef}
                    value={editValue}
                    className={`shopping-list__item-edit-input ${editValue.length < 2 ? 'shopping-list__item-edit-input--error' : ''}`}
                    onChange={handleEditValueChange}
                    onBlur={() => {
                        clearTimeout(blurTimeout.current);
                        blurTimeout.current = setTimeout(() => {
                            if (editId && editValue.trim().length >= 2) {
                                setEditValue(item.name);
                                setEditId(null);
                            } else if (editId && editValue.trim().length < 2) {
                                setEditValue(''); // Clear the edit value
                                setEditId(null); // Exit the edit mode
                            }
                        }, 200);
                    }}
                />
            ) : (
                <p className="shopping-list__item-name">{item.name}</p>
            )}
            <div className="shopping-list__item-buttons">
                {
                    editId === item.id ? (
                        <button
                            className={`shoppping-list__item-save-button shopping-list__item-button ${editValue.length < 2 ? 'button--disabled' : ''}`}
                            onClick={(e) => {
                                if (editValue.length < 2) {
                                    e.preventDefault();
                                    clearTimeout(blurTimeout.current);
                                    editInputRef.current.focus();
                                } else {
                                    clearTimeout(blurTimeout.current);
                                    handleUpdate(e);
                                }
                            }}
                        >
                            <FontAwesomeIcon icon={faCheck} />
                        </button>
                    ) : (
                        <button
                            className="shoppping-list__item-edit-button shopping-list__item-button"
                            onClick={() => handleEdit(item.id, item.name)}
                        >
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                    )
                }
                <button
                    className="shopping-list__item-delete-button shopping-list__item-button"
                    onClick={() => {
                        deleteItemMutation.mutate({ id: item.id });
                    }}
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
        </div>
    );
};

export default ShoppingListItem;
