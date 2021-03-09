/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from "express";
import { Songs } from "../../model/songs";
import { Users } from "../../model/users";
import { getAudioBuffer } from "../../util/audio/audio";
import { verifyToken } from "../../util/token/token";
import { QueryTypes, Op } from 'sequelize';
import { sequelize } from "../../model";
import { getRandomLyrics } from "../../util/lyrics/lyrics";
import { Correct_answer_rate } from "../../model/correct_answer_rate";
import { Users_and_songs } from "../../model/users_and_songs";
import { Scores } from "../../model/scores";

 /**
 * Controller Definitions
 */

 export const getQuiz = {
   getAudio : async(req : Request, res : Response) => {
    console.log("getAudio!");
    console.log("req : ", req.query);
    
    //여기서는 송 아이디를 받아 그 노래에서 랜덤으로 노래가사를 추출하고 오디오 버퍼로 바꿔서 response에 오디오 버퍼를 보내준다.


    // 1.클라이언트에서 서버로 조건(시대별)에 맞는 송아이디를 요청한다.
    // 2.서버에서는 클라이언트에 조건에 맞는 랜덤 송아이디를 보내준다.
    // 3.클라이언트는 받은 송 아이디를 스테이트에 저장하고, 서버로 다시 송아이디를 보낸다.(리퀘스트)
    // 4.서버는 클라이언트가 보내준 송아이디에서 랜덤으로 가사를 추출해 오디오 버퍼 파일을 보내준다.
    // 5-1. 서버에서 답을 채점하는 경우 : 클라이언트에서 2의 송아이디와 자신의 답을 서버로 보낸다. 서버에서는 받은 송아이디로 디비에서 제목을 검색하여 입력한 답과 일치하는지 확인하고 정답여부 리턴 
    // 5-2. 클라이언트에서 답을 채점하는 경우 : 2번에서 클라이언트에 송아이디와 함께 제목을 보내준다. 사용자가 정답을 입력하면 클라이언트에서 정답여부를 판별해 서버로 데이터를 리턴한다.

    //일단 오디오 버퍼 보내는 거 연습
    let bufferData = await getAudioBuffer('레가드 프로젝트 화이팅!');
    res.send(bufferData);

    // let targetSong = await Songs.findOne({
    //   where : {id : Number(req.query.songId)}
    // })
    
    // console.log("targetSong : ", targetSong);
    

   },
   songInfo : async(req : Request, res: Response) => {
     console.log("getQuiz!");
    // 1.여기서 조건(연도 별)에 맞게 랜덤으로 노래를 선택한다.
    let songAge = [Number(req.query.quizAge),Number(req.query.quizAge)+5];


    Songs.findOne({
      where : {
        year : {
          [Op.between] : songAge
        }
      },
      order : sequelize.random()
    })
    .then(result => {
      
      let lyrics : string = '';

      if(result) {
        lyrics = getRandomLyrics(result?.lyrics);
      }
      
      res.send({
        songId : result?.id,
        title : result?.title,
        year : result?.year,
        rank : result?.rank,
        album_title : result?.album_title,
        lyrics : lyrics,
        artist : result?.artist
      })
    })
    .catch(err => {
      console.log("err : ", err);
    })
   },
   recordResult : async(req : Request, res : Response) => {
     console.log("@@@@@@@@@@@@@recordResult!");
     
     
     let parseToken = verifyToken(String(req.headers.authorization))

     type _Decode = {
      id : any;
      sex : boolean;
      birth_year : number;
    }

    let {id,sex, birth_year} = parseToken as _Decode;
    let {songs_id, correct} = req.query;
     
    
    let recordCorrect : boolean
    correct === 'true'?recordCorrect = true : recordCorrect = false;
    
     if(parseToken){
      //로그인을 했을 때
      if(id !=='guest'){
        console.log("로그인 했을 때!!!!!!!!");
        
        let userRecord = await Users_and_songs.findOne({
          where : {user_id : id, song_id : songs_id}
        })
        if(userRecord){
          Users_and_songs.update({
            right_or_wrong : recordCorrect
          },{
            where : {
              user_id : userRecord.id
            }
          })
        }else{
          Users_and_songs.create({
            right_or_wrong : recordCorrect,
            id : null,
            user_id : id,
            song_id : Number(songs_id)
          })
        }

      }
      //로그인을 했든 안했든,,
      
       let info = await Correct_answer_rate.findOne({
         where : {
           sex,
           birth_year,
           songs_id
         }
       })
       if(!info){
         let correct_answer = recordCorrect? 1:0;
         let wrong_answer = recordCorrect? 0:1;
         Correct_answer_rate.create({
           id:null,
           songs_id : Number(songs_id),
           birth_year,
           sex,
           correct_answer,
           wrong_answer 
         })
         .then(() => {
           res.send({message : "ok"});
         })
         .catch(() => {
           res.status(404).send({message : "Err in record"})
         })
       }else{
         let id = info.getDataValue('id');   
         try{
          if(recordCorrect){
            Correct_answer_rate.increment({correct_answer : 1},{where : {id}});
           }else{
            Correct_answer_rate.increment({wrong_answer : 1}, {where : {id}});
           }
           res.send({message : "ok"})
         }catch(e){
          res.status(404).send({message : "Err in record"})
         }      
       }
     }else{
       res.status(409).send({message : "Invalid User"});
     }
   },
   submitScore: async(req : Request, res : Response) => {
      console.log("@@@submitScore@@@");
      console.log("req.headers.authorization : ", req.headers.authorization);
      console.log("req.query : ", req.query);
      let parseToken = verifyToken(String(req.headers.authorization))

      console.log("parsToken : ", parseToken);
      type parseTokenProps = {
        id:number;
      }

      let {id} = parseToken as parseTokenProps;

      console.log("ID : ",  id);
      console.log("ID : ", typeof id);
      
      if(parseToken && id){
        Scores.create({
          id :null,
          user_id : id,
          score : Number(req.query.totalScore),
          songs_year : Number(req.query.songs_year)
        })
        .then(result => {
          console.log("Score기록 성공 : ");
          res.send({message : "ok"})
        })
        .catch(err => {
          console.log("Score기록 실패 : ", err);
          res.status(404).send({message : "Err in record score"})
        })
      }else{
        res.status(409).send({message : "Invalid User"});
      }
      
   }


   
 }