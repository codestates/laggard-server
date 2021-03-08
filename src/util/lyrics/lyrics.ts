const getRandomLyrics = (lyrics : string) => {
  console.log("###getRandomLyrics : ", lyrics);
  let lyricsArr = lyrics.split(' ');
  console.log("###",lyricsArr);
  console.log("length : ", lyricsArr.length);
  
  let random = Math.floor(Math.random() * (lyricsArr.length-10)) + 1; 
  console.log("random : ",random);
  // let randomLyrics = lyricsArr[random].concat
  let randomLyrics:string = '';
  for(let i = 0; i < 20; i++){
    // randomLyrics.concat(lyricsArr[random+i])
    randomLyrics+=' '+lyricsArr[random+i];
  }
  console.log("randomLyrics : ", randomLyrics);
  return randomLyrics;

}

export {getRandomLyrics};