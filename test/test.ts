"use strict";

const { transform } = require('../index.js');
const test = require('tape')

  test('Transform with simple key', async (t) => {
    const expect = {this : "this"}
    const result = await transform({that : 'this'}, {this : "that"})
    t.deepEqual(result, expect);
    t.end();
  });
  
  test('Transform with undefined key', async (t) => {
    const expect = {this : "this"}
    const result = await transform({that : 'this'}, {this : "that", something : undefined})
    t.deepEqual(result, expect);
    t.end();
  });

  test('Transform with real example', async (t) => {
    const expect = {
      item: {
          uuid: "s1e1",
          id: "s1e1",
          releaseYear: "2021",
          releaseMonth: "10",
          releaseDay: "31",
          participants: {
              related: "s1e1 (new)",
              characters: [
                  {
                      name: "Bob",
                      role: "Person"
                  },
                  {
                      name: "Mary",
                      role: "Person"
                  }
              ]
          },
          category: {
              primary: {
                  category: "Television"
              },
              secondary: {
                  category: "Episodic"
              }
          }
      }
    };
    const result = await transform({
      id: 's1e1',
      name: 'Episode 1',
      active: true,
      releaseDate: '2021-10-31',
      details: {
          summary: 'Summarized',
          description: 'Long form description',
          tags: ['comedy', 'drama', 'dramedy'],
      },
      group: {
          category: 'Television',
          subcategory: 'Episodic',
      },
      characters: [
          {
              name: 'Bob',
              role: 'Person',
          },
          {
              name: 'Mary',
              role: 'Person',
          },
      ],
    },
    {
        item: {
            uuid: 'id',
            id: 'id',
            isActive: true,
            releaseYear: 'releaseDate',
            releaseMonth: 'releaseDate',
            releaseDay: 'releaseDate',
            tags: 'detailed.tags',
            participants: {
                related: 'id',
                characters: 'characters',
            },
            category: {
                primary: {
                    type: 'string',
                    category: 'group.category',
                },
                secondary: {
                    type: 'string',
                    category: 'group.subcategory',
                },
            },
        },
    },
    [
        {
            transformation: (val) => {
                return `${val} (new)`;
            },
            on: 'item.participants.related',
        },
        {
            transformation: (val) => {
                return val.split('-')[0];
            },
            on: 'item.releaseYear',
        },
        {
            transformation: (val) => {
                return val.split('-')[2];
            },
            on: 'item.releaseDay',
        },
        {
            transformation: (val) => {
                return val.split('-')[1];
            },
            on: 'item.releaseMonth',
        },
    ]);
    t.deepEqual(result, expect);
    t.end();
  });