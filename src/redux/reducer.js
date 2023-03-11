import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    tasks: [],
    taskId: 1
}

export const counterSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        setTaskId: (state, action) => {
            state.taskId = action.payload
        },
        setTasks: (state, action) => {
            state.tasks = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setTaskId, setTasks } = counterSlice.actions

export default counterSlice.reducer