import MidiWriter from "midi-writer-js";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../utils/firebase";

export default eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const track = new MidiWriter.Track();

    console.log(body)
    console.log(body.events)

    for (const e of body.events ?? []) {
      track.addEvent(new MidiWriter.NoteEvent(e));
    }

    if (body.tempo) {
      track.setTempo(body.tempo);
    }

    if (body.text) {
      track.addText(body.text);
    }

    if (body.copyright) {
      track.addCopyright(body.copyright);
    }

    if (body.track_name) {
      track.addTrackName(body.track_name);
    }

    if (body.instrument_name) {
      track.addInstrumentName(body.instrument_name);
    }

    if (
      typeof body.time_signature === "object" &&
      body.time_signature.numerator &&
      body.time_signature.denominator &&
      body.time_signature.midi_clocks_per_tick &&
      body.time_signature.notes_per_midi_clock
    ) {
      track.setTimeSignature(
        body.time_signature.numerator,
        body.time_signature.denominator,
        body.time_signature.midi_clocks_per_tick,
        body.time_signature.notes_per_midi_clock
      );
    }

    const write = new MidiWriter.Writer(track, {
      division: body.division ?? 128,
      tempo: body.tempo ?? 120,
    });

    const storageRef = ref(
      storage,
      `midi/${typeof body.track_name === 'string' ? body.track_name.replace(/\s+/g, '-') : 'Untitled'}-${Date.now()}.mid`
    );

    await uploadBytes(storageRef, write.buildFile(), {
      contentType: "audio/midi",
    });

    const url = await getDownloadURL(storageRef);

    return { data: url };
  } catch (error) {
    console.error(error);

    setResponseStatus(event, 400, "Bad Request");

    return {
      error: "Bad Request",
    };
  }
});
