import { Periods } from '../../model/periods';

console.log("======Create Periods Table======");

Periods.sync({force : true})
.then(() => {
    console.log("✅Success Create Periods Table");
})
.catch(err => {
    console.error("❗️Error in Create Periods Table");
}) 
