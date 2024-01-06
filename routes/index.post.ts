import MidiWriter from "midi-writer-js";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../utils/firebase";

export default eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const track = new MidiWriter.Track();

    if (body.tempo) {
      track.setTempo(body.tempo);
    }

    if (body.track_name) {
      track.addTrackName(body.track_name);
    }

    for (const e of body.events ?? []) {
      track.addEvent(new MidiWriter.NoteEvent(e));
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

    const write = new MidiWriter.Writer(track);

    const storageRef = ref(
      storage,
      `midi/${body.track_name.replace(/\s+/, '-')}-${Date.now()}.mid`
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
