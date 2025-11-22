const Event = require('../models/Event');

async function seed() {
  const event = new Event({
    name: 'Gamio Grand Battle',
    description: 'Weekend gaming tournament',
    venue: 'Gamio Arena',
    date: new Date(),
    slots: [
      {
        slotId: 'slot-1',
        startTime: new Date(Date.now() + 3600*1000),
        endTime: new Date(Date.now() + 7200*1000),
        seats: Array.from({length: 40}).map((_, i) => ({
          seatId: `A${i+1}`,
          price: (i < 10) ? 150 : 100,
          status: 'available'
        }))
      }
    ]
  });
  await event.save();
  console.log('Seeded event id', event._id);
}

module.exports = seed;
