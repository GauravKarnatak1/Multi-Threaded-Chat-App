import {userSocketIDs} from "../index.js";
export const getSockets=(users=[])=>{
     const sockets = users.map((user) => userSocketIDs.get(user.toString()));

  return sockets;
}