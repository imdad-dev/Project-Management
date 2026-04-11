import{Project } from "../models/project.models.js"
import{User } from "../models/user.model.js"
import{ProjectMember } from "../models/projectMember.models.js"
import { ApiResponse } from "../utils/api-response.js"
 import {ApiError} from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js";
 

const getProject = asyncHandler ( async (req , res)={
    // test
})


const getProjectById = asyncHandler ( async (req , res)={
    // test
})


const createProject = asyncHandler ( async (req , res)={
    // test
})


const updateProject = asyncHandler ( async (req , res)={
    // test
})


const deleteProject = asyncHandler ( async (req , res)={
    // test
})


const getProjectMember = asyncHandler ( async (req , res)={
    // test
})


const addProjectMember = asyncHandler ( async (req , res)={
    // test
})


const updateMemberRole = asyncHandler ( async (req , res)={
    // test
})


const deleteMember = asyncHandler ( async (req , res)={
    // test
})


export {
    getProject,
    getProjectById ,
    createProject ,
    updateProject ,
    deleteProject ,
    getProjectMember ,
    addProjectMember ,
    updateMemberRole ,
    deleteMember ,

}