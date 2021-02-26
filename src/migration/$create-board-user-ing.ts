import {Users} from '../model/users';
import {QueryInterface, Sequelize, ModelAttributes, ModelAttributeColumnOptions, Model, DataType, ModelAttributeColumnReferencesOptions, ModelValidateOptions, DataTypes} from 'sequelize';

class attributes implements ModelAttributeColumnOptions{
    type!: DataType;
    unique?: string | boolean | { name: string; msg: string; } | undefined;
    primaryKey?: boolean | undefined;
    autoIncrement?: boolean | undefined;
    autoIncrementIdentity?: boolean | undefined;
    comment?: string | undefined;
    references?: string | ModelAttributeColumnReferencesOptions | undefined;
    onUpdate?: string | undefined;
    onDelete?: string | undefined;
    validate?: ModelValidateOptions | undefined;
    values?: readonly string[] | undefined;
    allowNull?: boolean | undefined;
    field?: string | undefined;
    defaultValue?: unknown;
}


class attributes2 implements ModelAttributes{
    [x: string]: string | DataTypes.AbstractDataTypeConstructor | DataTypes.AbstractDataType | ModelAttributeColumnOptions<Model<any, any>>;
}
const a = new attributes();
a.allowNull = false;

const aa = new attributes2();
// aa.b = 1;

const idAttribute = new attributes();
idAttribute.type = DataTypes.INTEGER;
idAttribute.allowNull = false;
idAttribute.autoIncrement = true;
idAttribute.primaryKey = true;


const stringNotNullAttribute = new attributes();   //data type이 string이고 allowNull이 false인 attributes;
stringNotNullAttribute.type = DataTypes.STRING;
stringNotNullAttribute.allowNull = false;

const stringAllowNullAttribute = new attributes();  //data type이 string이고 allowNull이 true인 attributes;
stringAllowNullAttribute.type = DataTypes.STRING;
stringAllowNullAttribute.allowNull = true;

const integerNotNullAttribute = new attributes();   //data type이 integer이고 allowNull이 false인 attributes;
integerNotNullAttribute.type = DataTypes.INTEGER;
integerNotNullAttribute.allowNull = false; 

const dateNotNullAttribute = new attributes();
dateNotNullAttribute.type = DataTypes.DATE;
dateNotNullAttribute.allowNull = false;

// dateNotNullAttribute.references = {          //외래키 사용할 때
//     model : 'user'
// }

console.log("@@@@@@@@idAttribute : ",idAttribute);
console.log("##### : ", integerNotNullAttribute.toString());


// export const createUserBoard = {
//     up : async (queryInterface : QueryInterface, sequelize : Sequelize) => {
//         const newUser = await queryInterface.createTable('User',{
//             id : idAttribute,
//             email : stringNotNullAttribute,
//             password : stringAllowNullAttribute,
//             nickname : stringNotNullAttribute,
//             age : integerNotNullAttribute,
//             sex : integerNotNullAttribute
//             // sex : '{type : DataTypes.INTEGER, allowNull : false}'

//         })
//     },
//     down : async (queryInterface : QueryInterface, sequelize : Sequelize) => {
//         await queryInterface.dropTable('User');
//     }
// }

// export const createUserBoard = {
//     up : async (queryInterface : QueryInterface, sequelize : Sequelize) => {
//         const newUser = await queryInterface.createTable('User',{

//         },)
//     },
//     down : async (queryInterface : QueryInterface, sequelize : Sequelize) => {
//         await queryInterface.dropTable('User');
//     }
// }