import express, { Request, Response } from 'express';
import { getAudioBuffer } from '../../util/audio/audio';

export const getAudio = async (req: Request, res: Response) => {
  let bufferData = await getAudioBuffer(req.body.inputLyrics);
  if (bufferData) {
    res.status(200).send(bufferData);
  } else {
    res.status(404).send("there's no buffer data");
  }
};
