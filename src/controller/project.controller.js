import{Project } from "../models/project.models.js"
import{User } from "../models/user.model.js"
import{ProjectMember } from "../models/projectMember.models.js"
import { ApiResponse } from "../utils/api-response.js"
 import {ApiError} from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose"
import {userRoleEnum } from "../utils/constant.js"
 

const getProject = asyncHandler ( async (req , res)=>{
    // test
})


const getProjectById = asyncHandler ( async (req , res)=>{
    // test
})


const createProject = asyncHandler ( async (req , res)=>{
    
    const { name , description } = req.body;

    const project = await Project.create({
        name , 
        description ,
        createdBy : new mongoose.Types.ObjectId(req.user._id)
    });

    await ProjectMember.create({
        user : new mongoose.Types.ObjectId(req.user._id),
         project : new mongoose.Types.ObjectId(project._id),
         role : userRoleEnum.ADMIN ,
    });

    return res
    .status(200)
    .json(
        new ApiResponse(200, project , "project created successfuly")
    );
})


const updateProject = asyncHandler ( async (req , res)=>{
    
    const { name , description } = req.body;
    const {projectId} = req.params;

    const project = await Project.findByIdAndUpdate(
        projectId ,
        {
            name , 
            description ,
        },
        { new : true }
    );

    if(!project){
      throw  new ApiError(404, "Project Not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, project , "Update project successfuly")
    );
})


const deleteProject = asyncHandler ( async (req , res)=>{
    
    const { ProjectId} = req.params;

    const project = await Project.findByIdAndDelete(projectId);
 

   if(!project){
      throw  new ApiError(404, "Project Not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200 , project,"project delete successfuly")
    )

})


const getProjectMember = asyncHandler ( async (req , res)=>{
    // test
})


const addProjectMember = asyncHandler ( async (req , res)=>{
    // test
})


const updateMemberRole = asyncHandler ( async (req , res)=>{
    // test
})


const deleteMember = asyncHandler ( async (req , res)=>{
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