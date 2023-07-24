// Importing necessary React hooks and components for our ShoppingList component.
import { useState, useRef } from "react";  // To introduce and manage local state inside component
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";  // Hooks from react-query for managing server state 
import { getItems, addItem, deleteItem, updateItem } from "../../api/shoppingListApi";  // API calls to perform our CRUD operations
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";  // Component to display icons
import { faTrash, faEdit, faCheck } from "@fortawesome/free-solid-svg-icons";  // Icons used – trash bin for delete, upload for add
import "./shoppingList.css";  // Stylesheet for our ShoppingList component
import { Button } from '@mantine/core';
import { Plus } from 'tabler-icons-react';
import AddNewItemForm from "../addNewItemForm/AddNewItemForm.jsx";

// Define the ShoppingList component
const ShoppingList = () => {
    // Use the useState hook to create a state variable 'newItem' and a function to change it 'setNewItem'
    const [newItem, setNewItem] = useState("");
    const [editId, setEditId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const editInputRef = useRef();
    const newInputRef = useRef();
    const [newItemError, setNewItemError] = useState("");
    const [newItemInputIsFocused, setNewItemInputIsFocused] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const blurTimeout = useRef(null);




    // Initialize the query client instance
    const queryClient = useQueryClient();

    // Using 'useQuery' hook to fetch items from the shopping list and reflect their loading/error states
    const {
        data,  // The data returned from our query
        isLoading,  // State of whether our query is still loading
        isError,  // State of whether our query encountered an error
        error  // The error information if our query encountered an error
    } = useQuery(["items"], getItems,
        { select: data => [...data].sort((a, b) => b.createdAt - a.createdAt) }



    );  // The query itself, named "items", and calling the 'getItems' function

    // Using 'useMutation' to handle addition of items to the list. Updating the query data on successful completion.
    const addItemMutation = useMutation(addItem, {
        onSuccess: () => {
            queryClient.invalidateQueries("items");
        }
    });


    // Using 'useMutation' to handle deletion of items from the list. Updating the query data on successful completion.
    const deleteItemMutation = useMutation(deleteItem, {
        onSuccess: () => {
            queryClient.invalidateQueries("items");  // If the mutation succeeds, we make sure to refetch our items
        }
    });


    const updateItemMutation = useMutation(updateItem, {
        onSuccess: () => {
            // If the mutation succeeds, we make sure to refetch our items
            queryClient.invalidateQueries("items");
            setEditId(null);
        }
    });

    // The onSubmit handler used in our form.
    const handleSubmit = async (e) => {
        e.preventDefault();
        e.target.elements.newItem.disabled = true;
        setTimeout(() => {
            e.target.elements.newItem.disabled = false;
        }, 500);
        e.preventDefault();
        if (!newItemError && newItem.length >= 2) {
            try {
                await addItemMutation.mutateAsync({ userId: 1, name: newItem, completed: false });
                setNewItem("");
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleEdit = (id, name) => {
        setEditId(id);
        setEditValue(name);
        setTimeout(() => {
            editInputRef.current && editInputRef.current.focus();
        }, 0);
    };

    const handleBlur = () => {
        setNewItem(''); // Clear the input
        setNewItemInputIsFocused(false); // Remove focus
      };
      


    const handleUpdate = (e) => {
        e.preventDefault(); // prevent the button's default behavior
        if (editValue.trim().length >= 2) { // only proceed if editValue is valid
            updateItemMutation.mutate({ id: editId, name: editValue });
            setEditId(null); // clear editId to exit edit mode
        } else {

        }

    };




    const validateInput = (value, setError) => {
        if (value.length < 2) {
            setError("Input should have a minimum of 2 characters");
        } else {
            setError("");
        }
    };

    const handleNewItemChange = (e) => {
        const { value } = e.target;
        setNewItem(value);
        validateInput(value, setNewItemError);
    };


    const handleEditValueChange = (e) => {
        const { value } = e.target;
        setEditValue(value);
        validateInput(value, setEditValueError);
    };

    const handleDelayedBlur = () => {
        clearTimeout(blurTimeout.current);
    
        blurTimeout.current = setTimeout(() => {
            if (newItem.length >= 2) {
                handleBlur();
            } else {
                setNewItemInputIsFocused(false);
            }
        }, 200);
    };




    let content;  // Variable to store the content to be rendered
    if (isLoading) {
        // If the query is still loading, display a loading message
        content = <p>Loading...</p>
    } else if (isError) {
        // If the query encountered an error, display the error message
        content = <p>{error.message}</p>
    } else {
        // If the query succeeded, display the list of items
        content = data.map((item) => {
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
                            // onKeyDown={(e) => handleUpdate(e, item.id)}
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
        }
        );
    }


    return (
        <main className="shopping-list">
            <AddNewItemForm
                handleSubmit={handleSubmit}
                handleNewItemChange={handleNewItemChange}
                handleBlur={handleBlur}
                newItem={newItem}
                newItemInputIsFocused={newItemInputIsFocused}
                handleOnFocus={() => setNewItemInputIsFocused(true)}
                handleNewItemButtonClick={() => setNewItemInputIsFocused(true)}
            />
            <div className="shopping-list__items-container">
                {content}
            </div>

        </main>
    )
}

export default ShoppingList