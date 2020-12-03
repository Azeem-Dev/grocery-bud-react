import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'


const getLocalStore=()=>{
  let list=localStorage.getItem('list');
  if(list){
    return JSON.parse(localStorage.getItem('list'))
  }
  else{
    return []
  }
}

function App() {
  const [name,setName]=useState('');
  const [list,setList]=useState(getLocalStore);
  const [isEditing,setIsEditing]=useState(false);
  const [editId,setEditId]=useState(null);
  const [alert,setAlert]=useState({ 
    show:false ,
    msg:'',
    type:''
  });




  const handleSubmit =(e)=>{
    e.preventDefault();
    if(!name){
      // Display alert
      showAlert(true,'danger','Please Enter a Value');
    }
    else if(name && isEditing){
      setList(list.map((item)=>{
        if(item.id===editId){
          return {...item,title:name}
        }
        return item;
      }))
      setName('');
      setEditId(null);
      setIsEditing(false);
      showAlert(true,'success','value Changed')
    }
    else{
      showAlert(true,'success','Item added to the string')
      const newItem={id:new Date().getTime().toString(),
      title:name};
      setList([...list,newItem]);
      setName('');
    }
  }


  const showAlert=(show=false,type='',msg='')=>{
    setAlert({show,type,msg});
  }

  const clearList=()=>{
    showAlert(true,'danger','empty list');
    setList([]);
  }
  const deleteItem=(id)=>{
    showAlert(true,'danger','Item Removed');
    let newList = list.filter(item=>item.id!==id);
    setList([...newList]);
  }
  const editItem=(id)=>{
    const specificItem = list.find((item)=>item.id===id);
    setIsEditing(true);
    setEditId(id);
    setName(specificItem.title);

  }


  useEffect(()=>{
    localStorage.setItem('list',JSON.stringify(list))
  },[list])


  return <section className="section-center">
    <form className="gorcery-from" onSubmit={handleSubmit}>
      {
      alert.show && <Alert {...alert} removeAlert={showAlert} list={list}/>
      }
      <h3>grocery bud</h3>
      <div className="form-control">
        <input type="text" className="grocery" placeholder='e.g egg' value={name} onChange={(e)=>setName(e.target.value)}/>
        <button type='submit' className='submit-btn'>
          {isEditing?'edit':'submit'}
        </button>
      </div>
    </form>
    {list.length>0 &&(
    <div className="grocery-container">
      <List items={list} deleteItem={deleteItem} editItem={editItem}/>
      <button className="clear-btn" onClick={clearList}>
        CLEAR ITEMS
      </button>
    </div>
    )
  }
  </section>
}

export default App
