import { Tests } from '../../model/tests';

console.log("======Create Tests Tables======");

Tests.sync({force : true})
.then(() => {
    console.log("✅Success Create Tests Tables");
})
.catch((err) => {
    console.error("❗️Error in Create Tests Tables : ", err);
    
})
