import { Correct_answer_rate } from '../../model/correct_answer_rate';

console.log("======Create Correct_answer_rate_table======");

const create_table_correct_answer_rate = async () => {
    await Correct_answer_rate.sync({force : true})
    .then(() => {
        console.log("✅Success Create Correct_answer_rate Table");
    })
    .catch((err) => {
        console.log("❗️Err in Create Correct_answer_rate Table : ", err);
        
    })
}

create_table_correct_answer_rate();


