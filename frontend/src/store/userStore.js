import {create } from 'zustand';
import axios from "axios";
import { useAuthStore } from './authStore';
import toast from 'react-hot-toast';

axios.defaults.withCredentials=true;

const API_URL='http://localhost:3000/api/v1/user'

export const useUserStore = create((set,get) => ({  
    userProfile:null,
    isuserProfileLoading:false,
    error:null,
    message:null,
    newUsers:[],
    isNewUsersLoading:false,
    notifications:[],
    getProfile:async()=>{
        set({isuserProfileLoading:true,error:null,message:null});
        try{
            const res=await axios.get(`${API_URL}/get-profile`);
            set({userProfile:res.data,isuserProfileLoading:false});
            console.log("User Profile",res.data);
        }catch(err){
            set({ error: err.response?.data?.message || err.message, isUserProfileLoading: false });
        }
    },

    updateProfile:async(formData)=>{
        console.log(formData.bio);
        set({isLoading:true,error:null,message:null});
        try{
            const res=await axios.put(`${API_URL}/update-profile`,formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                  },
            });
            console.log("Update Profile Response",res.data.user);
            set({userProfile:res.data.user,isLoading:false});
            const {setUser}=useAuthStore.getState();
            setUser(res.data.user);
            toast.success(res.data.message);
        }catch (err) {
            set({ error: err.response?.data?.message || err.message, isUserProfileLoading: false });
            toast.error(err.response?.data?.message || "Failed to update profile");
        }
    },

     fetchNewUsers:async()=>{
    set({ isNewUsersLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/get-newusers`, {
        withCredentials: true, 
      });
      console.log("New Users Response",response.data);
      if (response.data.success) {
        set({ newUsers: response.data.users, isNewUsersLoading: false });
      } else {
        set({ error: response.data.message || 'Failed to fetch new users', isNewUsersLoading: false });
      }
    } catch (err) {
      set({ error: err.message, isNewUsersLoading: false });
    }
    },
   
    sendFriendRequest:async(userId)=>{
        set({isNewUserLoading:true,error:null,message:null});
        try{
          console.log("Sending Friend Request to",{userId});
             const res = await axios.put(
            `${API_URL}/send-request`,
            { receiverId:userId },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            }
        );
            console.log("Send Friend Request Response",res.data);
            set({message:res.data.message,isNewUserLoading:false});
            toast.success(res.data.message);
        }catch (err) {
            set({ error: err.response?.data?.message || err.message, isNewUserLoading: false });
            toast.error(err.response?.data?.message || err.message);
        }
    },
    
    getMyNotifications:async()=>{
        set({isLoading:true,error:null,message:null});
        try{
            const res=await axios.get(`${API_URL}/get-my-notifications`);
            console.log("Notifications Response",res.data);
            set({notifications:res.data.allRequests,isLoading:false});
        }catch (err) {
            set({ error: err.response?.data?.message || err.message, isLoading: false });
        }
    },

    addNotification:(notification)=>{
        set(state=>({
            notifications:[notification,...state.notifications]
        }));
    }, 
    acceptFriendRequest:async(requestId,accept)=>{
        set({error:null,message:null});
        try{
            const res=await axios.put(`${API_URL}/accept-request`,{requestId,accept});
            console.log("Accept Friend Request Response",res.data);
            get().getMyNotifications();
            set({message:res.data.message});
            toast.success(res.data.message);
        }catch (err) {
            set({ error: err.response?.data?.message || err.message });
            toast.error(err.response?.data?.message || err.message);
        }
    } 

}));