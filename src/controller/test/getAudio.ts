import express, { Request, Response } from 'express';
import { getAudioBuffer } from '../../util/audio/audio';

export const getAudio = async (req: Request, res: Response) => {
  console.log('오디오 내놔');
  console.log(req.body);

  let bufferData = await getAudioBuffer(req.body.inputLyrics);
  if (bufferData) {
    res.status(200).send(bufferData);
  } else {
    res.status(404).send("there's no buffer data");
  }
};
