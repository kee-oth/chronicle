type Chronicle<Event> = {
  currentRecord: Event;
  pastRecords: Event[];
  allRecords: Event[];
  addRecord: (newRecord: Event) => ThisType<Event>; // This mutates the Chronicle and returns it (as `this`)
};

type ChronicleWithLogger<Event, LogOutput> = Chronicle<Event> & {log: () => LogOutput;};

type CreateChronicleOptions<Event, LogOutput> = {
  onLog: (records: Event[]) => LogOutput;
};

// const thing2: ChronicleWithLogger<string, number> = {
//   log: () => 4,
//   currentRecord: 'asdf',
//   pastRecords: [],
//   allRecords: [],
//   addRecord: function () { return this }
// }

// const thing3: Chronicle<string> = {
//   currentRecord: 'asdf',
//   pastRecords: [],
//   allRecords: [],
//   addRecord: function () { return this }
// }

type CreateChronicle = {
  <Event, LogOutput = never>(
    initialRecord: Event,
    options: CreateChronicleOptions<Event, LogOutput>
  ): Chronicle<Event>;
  <Event>(
    initialRecord: Event,
  ): Chronicle<Event>;
}

// either need to switch params to object to keep unary vibes OR 
// need to just create a `createChronicleWithLogger` function that requires the logger (easier and more explicit usage) // lets do this one

function createChronicle<Event, LogOutput = never>(
  initialRecord: Event,
  options: CreateChronicleOptions<Event, LogOutput>
): ChronicleWithLogger<Event, LogOutput>;

function createChronicle<Event>(
  initialRecord: Event,
): Chronicle<Event>

function createChronicle<Event, LogOutput>(
  initialRecord: Event,
  options: CreateChronicleOptions<Event, LogOutput>
): Chronicle<Event> {

// export const createChronicle: CreateChronicle = (
//   ...args
// ) => {

  return {
    currentRecord: initialRecord,
    pastRecords: [],
    get allRecords() {
      return [this.currentRecord, ...this.pastRecords];
    },
    log: function log() {
      return options?.onLog?.(this.allRecords);
      // if (options?.onLog) {
      //   return onLog(this.allRecords);
      // } else {
      //   return onLog(this.allRecords)
      // }
    },
    addRecord: function (newRecord) {
      this.pastRecords = [this.currentRecord, ...this.pastRecords];
      // Important to not mutate currentRecord until after setting pastRecords
      this.currentRecord = newRecord;
      return this;
    },
  };
};

const archiveA = createChronicle('initial record', {
  onLog: (records) =>
    new Promise<number>((resolve) => {
      setTimeout(() => {
        console.log('records', records);
        resolve(3);
      }, 1000);
    }),
});

const thing = archiveA.log();

archiveA.addRecord('record 2');
archiveA.addRecord('record 3');

archiveA.log().then((data) => console.log('data', data));