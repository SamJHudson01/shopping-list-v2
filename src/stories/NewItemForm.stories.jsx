// Import necessary dependencies and styles
import React from 'react';
import { action } from '@storybook/addon-actions';
import NewItemForm from '../components/addNewItemForm/AddNewItemForm.jsx'

// Export metadata for the component
export default {
    title: 'NewItemForm',
    component: NewItemForm,
};

// Define a template for creating the stories
const Template = (args) => <NewItemForm {...args} />;

// Define stories based on the template
export const Default = Template.bind({});
Default.args = {
    handleSubmit: action('Form submitted'),
    handleNewItemChange: action('Input field value changed'),
    handleBlur: action('Input field blurred'),
    newItem: '',
    newItemInputIsFocused: false,
    handleOnFocus: action('Input field focused'),
    handleNewItemButtonClick: action('Submission button clicked'),
};

// Other variations of the component for different props can also be similarly created
export const FocusedWithError = Template.bind({});
FocusedWithError.args = {
    ...Default.args,
    newItem: 'T',
    newItemInputIsFocused: true,
};