import {ACTION} from './App'
export default function OperationButton({dispatch,operation}){
   return <button  style={{ color: 'white',backgroundColor: 'black' }} onClick={()=>dispatch({type:ACTION.CHOOSE_OPERATION,payload:{operation}})}>{operation}</button>
}