import {Scores} from '../../model/scores';

console.log("======Create Score Tables======");

const create_table_scores = async() => {
    await Scores.sync({force : true})
    .then(() => {
        console.log("✅Success Create Score Tables");
    })
    .catch((err) => {
        console.log("❗️Err in Create Score Tables : ", err);
        
    })
}

create_table_scores();

