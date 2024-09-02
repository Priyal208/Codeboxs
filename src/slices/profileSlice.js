import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    loading: false,
};

const profileSlice = createSlice({
    name: "profile",
    initialState, 
    reducers: {
        setUser(state, action) {  // Use "action" to refer to the whole action object
            state.user = action.payload;  // Now, action.payload will contain the user data directly
        },
        setLoading(state, action) {  // Also use "action" for consistency
            state.loading = action.payload;
        },
    },
}); 


export const {setUser, setLoading} = profileSlice.actions;
export default profileSlice.reducer;