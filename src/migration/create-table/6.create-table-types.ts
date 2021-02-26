import {Types} from '../../model/types';

console.log("======Create Types Table======");

Types.sync({force : true})
.then(() => {
    console.log("✅Success Create Types Table");
})
.catch(err => {
    console.log("❗️Err in Create Types Table : ", err);
    
})