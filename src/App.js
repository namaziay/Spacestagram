
import './App.css';
import {useState,useEffect} from 'react'
import { CopyToClipboard } from "react-copy-to-clipboard"
import {
  Button
} from "@material-ui/core"

//API KEY FROM .env file
const APIKEY = process.env.REACT_APP_API_KEY

function App() {
  const [MarsPhotos,setMarsPhotos] = useState([]);
  const [fetched,setFetched] = useState(false);
  const [like,setLike] = useState([]);
  
  
  const likeHandler =(id)=>{
    setLike(prev=>{
      return [...prev,id]
    })
  }

  const removeHandler=(id)=>{
    const removedLike = like.filter(curr=> curr!==id);
    setLike(removedLike);
  }

  useEffect(()=>{
    async function fetchData(){
      const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${APIKEY}`)
      const data = await response.json()
      setMarsPhotos(data.photos)
      setFetched(true)
    }
    fetchData();
  },[fetched])

  useEffect(()=>{
    setLike(JSON.parse(window.localStorage.getItem('like')))
    if(!like){
      setLike([])
    }
  },[])
  useEffect(()=>{
    if(like){
    window.localStorage.setItem('like',JSON.stringify(like))
    }
    else{
      setLike([])
    }
  },[like])
  return (
    <>
      {
        fetched ?
        <>
          <div className="container">
          <h2>Spacestagram</h2>
          <h3 className ='h3'>Brought to you by NASA's image API</h3>
          {MarsPhotos.slice(0,10).map(photo=>{
            return(
              <div className='post-container'>

                <img src = {photo.img_src} />
                <h3>{`${photo.rover.name}-${photo.camera.full_name}`}</h3>
                <h5>{photo.earth_date}</h5>
                <div>
                {
                like?.includes(photo.id)===false?
                <i onClick = {()=>likeHandler(photo.id)} className="material-icons">favorite</i>:
                <i onClick = {()=>removeHandler(photo.id)} className="material-icons red-text" aria-hidden="true" style={{ color: 'red' }}>favorite</i>
                 }

                <CopyToClipboard text={photo.img_src}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                  Copy Image URL
                  </Button>
                </CopyToClipboard>

                </div>
            </div>
            )
        })}
          </div>
        </>
        :<div class="lds-ring"><div></div><div></div><div></div><div></div></div>
      }
   </>
  );
}

export default App;
