import axios from 'axios';
import { Songs } from '../model/songs';


//! 노래 데이터 import 안될 때 최후의 수단
const migrateSongData = () => {
  axios
    .get('http://localhost:4000/songs')
    .then((data) => data.data)
    .then((data) => {
      console.log(Array.isArray(data));
      for (let el of data) {
        const {
          g_songId,
          title,
          artist,
          lyrics,
          album_title,
          publishedAt,
          genre,
          rank,
          idol_index,
        } = el;
        console.log(g_songId);
        Songs.create({
          id: null,
          g_songId,
          title,
          artist,
          lyrics,
          album_title,
          year: publishedAt,
          genre,
          rank,
          idol_index,
        });
      }
      return data;
    });
};

export { migrateSongData };
