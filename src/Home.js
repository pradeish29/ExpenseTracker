import React from 'react'
import {auth, db} from './Firebase'
import { useState, useEffect } from 'react'; 
import {collection, doc, addDoc, deleteDoc, serverTimestamp,query,where, orderBy, onSnapshot} from 'firebase/firestore'
import { useNavigate, Navigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

export const useGetUserInfo = () => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
    const {name, photo,userID, isAuth}= JSON.parse(localStorage.getItem("auth"))
   return{name,photo,userID,isAuth}
    }
    return { name: null, photo: null, userID: null, isAuth: false };
  }

export const Home = () => {
    const[newExp, setNewExp] = useState("")
    const[newPrice, setNewPrice] = useState("")
    const[newType, setNewType] = useState("Expense")
    const[trans, setTrans] = useState([]);
    const[total, setTotal] = useState({balance:0.0, income:0.0, expense:0.0})
    const transCollectionRef = collection(db, "may")
    const {userID,name,photo,isAuth} = useGetUserInfo()
    const navigate = useNavigate();

    const signUserOut = async () =>{
        try{
        await signOut(auth);
        localStorage.clear()
        navigate("/")
        } 
        catch(err){
            console.error(err)
            alert(`Error signing out: ${err.message}`);
        }
    }
    
    const getTrans = async()=>{

    let unsubscribe
    try{
      const queryTrans= query(transCollectionRef, where("userID","==",userID),orderBy("createdAt"))
      console.log(queryTrans)

     unsubscribe = onSnapshot(queryTrans, (snapshot)=>{
        let docs=[];
        let totalIncome=0
        let totalExpense=0

        snapshot.forEach((doc)=>{
            const data = doc.data()
            const id = doc.id
            docs.push({...data, id})

            if(data.type === "Expense"){
                totalExpense += Number(data.price)
            }
            else{
                totalIncome += Number(data.price)
            }
        })
        setTrans(docs)
        let balance=totalIncome - totalExpense
        setTotal({
            balance,
            expense:totalExpense,
            income:totalIncome
        })
      })
    }catch(err){
        console.error(err)
    }
    return () => unsubscribe();
    }
  
    const createTran = async () =>{
      await addDoc(transCollectionRef, {userID:userID,exp:newExp, price: Number(newPrice), type:newType,createdAt: serverTimestamp()});
      getTrans();
      setNewExp("")
      setNewPrice("") 
      setNewType("")
    }
  
    const deleteTran = async (id) =>{
      const tranDoc= doc(db, "may",id)
      await deleteDoc(tranDoc)
      getTrans();
    }
 
    useEffect(() => {
        if (isAuth) {
          getTrans(); // Fetch transactions if authenticated
        } else {
          navigate("/"); // Redirect to login if not authenticated
        }
      }, [isAuth, navigate]); // Added navigate as a dependency
    
      if (!isAuth) {
        return <Navigate to="/" />; // Early return to login if not authenticated
      }
  
    return (
      <div className="Home">
        <div className='nav'>
        <div className='title'><h1>Budget Padmanabhan</h1></div>
        
        <div className='profile container'>
        <h3>{name}</h3>
        {photo && (
            <div className='photo'>
                <img src={photo}/>
            </div>
        )}
        <button className="signout" onClick={signUserOut}>Sign Out</button>
        </div>
        </div>
        <div className='container'>

        <div className="form-card">
          <div className='balance container'>
            <h2>Balance:</h2>
            {total.balance >= 0 ?
            (<h2>₹{total.balance}</h2>):(<h2>-₹{total.balance* -1}</h2>)
        }
          </div>
          <div className='balance container'>
            <h3>Income:</h3>
            <h3>₹{total.income}</h3>
          </div>
          <div className='balance container'>
            <h3>Expense:</h3>
            <h3>₹{total.expense}</h3>
          </div>

          <h3>Add an Entry</h3>
            <input placeholder="Expense" required value={newExp}
            onChange={(event)=>{
              setNewExp(event.target.value)
            }} />
            <input type="number" required placeholder="Amount" value={newPrice}
            onChange={(event)=>{
              setNewPrice(event.target.value)
            }}
            />
            <div className='radio'>
            <input type='radio'value="Expense" id='expense' checked={newType==="Expense"}
            onChange={(event)=>{
                setNewType(event.target.value)}}/>
            <label htmlFor='expense'>Expense</label>

            <input type='radio'value="Income" id='income' checked={newType==="Income"}
            onChange={(event)=>{
                setNewType(event.target.value)}}/>
            <label htmlFor='income'>Income</label>     
            </div>
    
            <button onClick={createTran}>Add Entry</button>
            
        </div>

        <div className="user-table">
          <h2>Transaction</h2>
          <table>
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trans.map((tran)=>{
              return (<tr> 
                <td>{tran.exp}</td>
                <td>₹{tran.price}</td>
                <td style={{color: tran.type==="Expense"?"red":"darkgreen"}}>{tran.type}</td>
                <td>
                <button onClick={()=>{deleteTran(tran.id)}}>Delete</button>
                </td>
                </tr>
                )
            })}
            </tbody>
          </table>
        </div>

        </div>
    </div>
    );
}