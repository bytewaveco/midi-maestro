import MidiWriter from "midi-writer-js";

export default eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const track = new MidiWriter.Track();

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

    return { data: write.dataUri() };
  } catch (error) {
    console.error(error);

    setResponseStatus(event, 400, "Bad Request");

    return {
      error: "Bad Request",
    };
  }
});