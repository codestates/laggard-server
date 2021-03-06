import textToSpeech from '@google-cloud/text-to-speech';

export const getAudioBuffer = async (lyrics: string): Promise<any> => {
  const client = new textToSpeech.TextToSpeechClient();

  const text: string = lyrics;

  interface ISynthesisInput {
    /** SynthesisInput text */
    text?: string | null;

    /** SynthesisInput ssml */
    ssml?: string | null;
  }

  enum SsmlVoiceGender {
    SSML_VOICE_GENDER_UNSPECIFIED = 0,
    MALE = 1,
    FEMALE = 2,
    NEUTRAL = 3,
  }

  interface IVoiceSelectionParams {
    /** VoiceSelectionParams languageCode */
    languageCode?: string | null;

    /** VoiceSelectionParams name */
    name?: string | null;

    /** VoiceSelectionParams ssmlGender */
    ssmlGender?: SsmlVoiceGender | null;
  }

  enum AudioEncoding {
    AUDIO_ENCODING_UNSPECIFIED = 0,
    LINEAR16 = 1,
    MP3 = 2,
    OGG_OPUS = 3,
  }

  interface IAudioConfig {
    /** AudioConfig audioEncoding */
    audioEncoding?: AudioEncoding | null;

    /** AudioConfig speakingRate */
    speakingRate?: number | null;

    /** AudioConfig pitch */
    pitch?: number | null;

    /** AudioConfig volumeGainDb */
    volumeGainDb?: number | null;

    /** AudioConfig sampleRateHertz */
    sampleRateHertz?: number | null;

    /** AudioConfig effectsProfileId */
    effectsProfileId?: string[] | null;
  }

  interface ISynthesizeSpeechRequest {
    /** SynthesizeSpeechRequest input */
    input?: ISynthesisInput | null;

    /** SynthesizeSpeechRequest voice */
    voice?: IVoiceSelectionParams | null;

    /** SynthesizeSpeechRequest audioConfig */
    audioConfig?: IAudioConfig | null;
  }

  class request implements ISynthesizeSpeechRequest {
    input!: ISynthesisInput;
    voice!: IVoiceSelectionParams;
    audioConfig!: IAudioConfig;
  }

  const voiceRequest = new request();
  const voiceGender: SsmlVoiceGender = 3;
  const audioEncodingType: AudioEncoding = 1;

  voiceRequest.input = { text };
  voiceRequest.voice = { languageCode: 'ko-KR', ssmlGender: voiceGender };
  voiceRequest.audioConfig = {
    audioEncoding: audioEncodingType,
    speakingRate: 0.78,
  };

  // const request = {
  //   input: {text: text},
  //   // Select the language and SSML voice gender (optional)
  //   voice: {languageCode: 'ko-KR', ssmlGender: 'NEUTRAL'},
  //   // select the type of audio encoding
  //   audioConfig: {audioEncoding: 'LINEAR16', speakingRate : 1},

  // };

  const [response] = await client.synthesizeSpeech(voiceRequest);

  return response.audioContent;
};
