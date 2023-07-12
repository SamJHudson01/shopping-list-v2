import axios from "axios";

const shoppingListApi = axios.create({
    baseURL: "http://localhost:3500",
});

export const getItems = async () => {
    const response = await shoppingListApi.get("/items");
    console.log(response.data);
    return response.data;
    
}

export const addItem = async (item) => {
    const itemWithTimestamp = {
        ...item,
        createdAt: Math.floor(Date.now() / 1000)
    };
    const response = await shoppingListApi.post("/items", itemWithTimestamp);
    return response.data;
}


export const deleteItem = async ({id}) => {
    const response = await shoppingListApi.delete(`/items/${id}`);
    return response.data;
}

export const updateItem = async (item) => {
    const response = await shoppingListApi.patch(`/items/${item.id}`, item);
    return response.data;
}


export default shoppingListApi;
