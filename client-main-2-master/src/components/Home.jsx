import * as React from "react";
import { Box } from "@mui/material"
import commonApi from "../api/common";
import Toggle from "./toggle";
import { useState, useEffect ,useContext } from "react";
import Post from "./Post";

// import commonApi from "../api/common";
//import Avatar from '@mui/material/Avatar'
//import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

//import CardContent from '@mui/material/CardContent';

//import Stack from '@mui/material/Stack';

import MiniDrawer from "./drawer";
import { Context ,} from "../userContext/Context";

export default function Home() {
  //const [Images, setImage] = useState([]);
  const [toggle,setToggle]=useState(false)
  const [posts, setPosts] = useState([]);
  const {user}= useContext(Context)
  const fetchPosts = async () => {
    let data={}

    if(toggle)
    {
      data={options:true,userId:user._id}
     
    }
    await commonApi({
      action: "findAllPost",
      data: {data:data},
    }).then((res) => {
      setPosts(res);
    });
  };
  const handleToggle=()=>{
    setToggle(!toggle)
  }
  useEffect(() => {
    fetchPosts();
   }, [toggle]);

  return (
    <>
  <Toggle handleToggle={handleToggle} toggle={toggle}/>
      <MiniDrawer />
      {posts.map((post) => {
        return <Post post={post} fetchPosts={fetchPosts} />;
      })}
      {posts.length===0 && <Box sx={{marginLeft:"300px"}}>No Post Found</Box>}
    </>
  );
}