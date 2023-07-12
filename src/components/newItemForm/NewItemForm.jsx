import './newItemForm.css';  // I assume you saved your CSS in NewItemSection.css file
import { Button } from '@mantine/core';
import { Plus } from 'tabler-icons-react';

const NewItemForm = ({ handleSubmit, handleNewItemChange, handleBlur, newItem,  newItemInputIsFocused, handleOnFocus, handleNewItemButtonClick }) => {


    return (
        <form className="shopping-list__new-item-form" onSubmit={handleSubmit}>
            <div className="shopping-list__add-new-item-input-container">
                <input
                    className={`shopping-list__add-new-item-input ${newItemInputIsFocused && newItem.length < 2 ? 'shopping-list__add-new-item-input--error' : ''}`}
                    type="text"
                    id="newItem"
                    value={newItem}
                    onChange={handleNewItemChange}
                    placeholder="Add new item"
                    onFocus={handleOnFocus}
                    onBlur={handleBlur}
                />
                <Button className="shopping-list__add-new-item-button" type="submit"
                    onClick={handleNewItemButtonClick}>
                    <Plus />
                </Button>
            </div>
        </form>
    );
};

export default NewItemForm;